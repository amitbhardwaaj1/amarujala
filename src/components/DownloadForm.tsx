import { useState, useMemo, useEffect } from "react";
import { Calendar, MapPin, FileText, Download, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNewspaper } from "@/contexts/NewspaperContext";
import { getOrderedCities, citiesData } from "@/data/cities";
import { getJagranStates, getJagranCitiesByState } from "@/data/jagranCities";
import { getTOICities } from "@/data/toiCities";
import { NewspaperId } from "@/data/newspapers";

interface HTEdition {
  EditionId: number;
  EditionName: string;
  Supplement?: { EditionId: number; EditionDisplayName: string }[];
}

interface DownloadFormProps {
  onDownload: (
    newspaper: NewspaperId,
    city: string,
    date: string,
    paperType?: string,
    state?: string,
    subCity?: string
  ) => void;
  isLoading: boolean;
}

export function DownloadForm({ onDownload, isLoading }: DownloadFormProps) {
  const { currentPaper } = useNewspaper();

  // Amar Ujala state
  const amarCities = useMemo(() => getOrderedCities(), []);
  const [amarCity, setAmarCity] = useState(amarCities[0]?.slug || "");
  const [paperType, setPaperType] = useState("main");

  // Dainik Jagran state
  const jagranStates = useMemo(() => getJagranStates(), []);
  const [jagranState, setJagranState] = useState(jagranStates[0] || "");
  const jagranCities = useMemo(() => getJagranCitiesByState(jagranState), [jagranState]);
  const [jagranCity, setJagranCity] = useState("");

  // Times of India state
  const toiCities = useMemo(() => getTOICities(), []);
  const [toiCity, setToiCity] = useState("delhi");

  // Hindustan Times state (dynamic)
  const [htEditions, setHtEditions] = useState<HTEdition[]>([]);
  const [htCity, setHtCity] = useState("");
  const [htSubCity, setHtSubCity] = useState("");
  const [htLoading, setHtLoading] = useState(false);

  // Common date
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  // Reset selections when paper changes
  useEffect(() => {
    if (currentPaper.id === "dainik-jagran" && jagranCities.length > 0 && !jagranCity) {
      setJagranCity(jagranCities[0].slug);
    }
  }, [currentPaper.id, jagranCities, jagranCity]);

  // Fetch HT editions when switching to HT or date changes
  useEffect(() => {
    if (currentPaper.id === "hindustan-times") {
      const fetchHTEditions = async () => {
        setHtLoading(true);
        try {
          const dateObj = new Date(date);
          const formattedDate = `${String(dateObj.getDate()).padStart(2, "0")}/${String(
            dateObj.getMonth() + 1
          ).padStart(2, "0")}/${dateObj.getFullYear()}`;

          const res = await fetch(
            `https://epaper.hindustantimes.com/Home/GetEditionSupplementHierarchy?EditionDate=${formattedDate}`,
            { method: "GET", headers: { "Content-Type": "application/json" } }
          );
          const data = await res.json();
          setHtEditions(data || []);

          if (data && data.length > 0) {
            setHtCity(String(data[0].EditionId));
            if (data[0].Supplement && data[0].Supplement.length > 0) {
              setHtSubCity(String(data[0].Supplement[0].EditionId));
            }
          }
        } catch (error) {
          console.error("Failed to fetch HT editions:", error);
          setHtEditions([]);
        } finally {
          setHtLoading(false);
        }
      };
      fetchHTEditions();
    }
  }, [currentPaper.id, date]);

  // Update HT sub-cities when city changes
  const htSubCities = useMemo(() => {
    const edition = htEditions.find((e) => String(e.EditionId) === htCity);
    return edition?.Supplement || [];
  }, [htEditions, htCity]);

  useEffect(() => {
    if (htSubCities.length > 0 && !htSubCities.some((s) => String(s.EditionId) === htSubCity)) {
      setHtSubCity(String(htSubCities[0].EditionId));
    }
  }, [htSubCities, htSubCity]);

  const hasMycity = useMemo(() => {
    const city = citiesData[amarCity];
    return city?.is_mycity === "Y";
  }, [amarCity]);

  const handleCityChange = (value: string) => {
    setAmarCity(value);
    setPaperType("main");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    if (currentPaper.id === "amar-ujala") {
      onDownload(currentPaper.id, amarCity, date, paperType);
    } else if (currentPaper.id === "dainik-jagran") {
      onDownload(currentPaper.id, jagranCity, date, undefined, jagranState);
    } else if (currentPaper.id === "hindustan-times") {
      onDownload(currentPaper.id, htCity, date, undefined, undefined, htSubCity);
    } else if (currentPaper.id === "times-of-india") {
      onDownload(currentPaper.id, toiCity, date);
    }
  };

  const maxDate = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="glass-card rounded-2xl p-6 md:p-8 animate-scale-in">
        {/* Amar Ujala Form */}
        {currentPaper.id === "amar-ujala" && (
          <>
            <div className="space-y-2 mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Select City
              </label>
              <Select value={amarCity} onValueChange={handleCityChange}>
                <SelectTrigger className="w-full h-12 bg-input border-border text-foreground">
                  <SelectValue placeholder="Choose your city" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border max-h-64">
                  {amarCities.map((city) => (
                    <SelectItem key={city.slug} value={city.slug} className="text-foreground hover:bg-muted focus:bg-muted">
                      {city.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="w-4 h-4" />
                Paper Type
              </label>
              <Select value={paperType} onValueChange={setPaperType}>
                <SelectTrigger className="w-full h-12 bg-input border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="main" className="text-foreground hover:bg-muted focus:bg-muted">
                    Main Edition
                  </SelectItem>
                  {hasMycity && (
                    <SelectItem value="mycity" className="text-foreground hover:bg-muted focus:bg-muted">
                      My City
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Dainik Jagran Form */}
        {currentPaper.id === "dainik-jagran" && (
          <>
            <div className="space-y-2 mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Building2 className="w-4 h-4" />
                Select State
              </label>
              <Select value={jagranState} onValueChange={(v) => { setJagranState(v); setJagranCity(""); }}>
                <SelectTrigger className="w-full h-12 bg-input border-border text-foreground">
                  <SelectValue placeholder="Choose state" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border max-h-64">
                  {jagranStates.map((state) => (
                    <SelectItem key={state} value={state} className="text-foreground hover:bg-muted focus:bg-muted">
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Select City
              </label>
              <Select value={jagranCity} onValueChange={setJagranCity}>
                <SelectTrigger className="w-full h-12 bg-input border-border text-foreground">
                  <SelectValue placeholder="Choose city" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border max-h-64">
                  {jagranCities.map((city) => (
                    <SelectItem key={city.slug} value={city.slug} className="text-foreground hover:bg-muted focus:bg-muted">
                      {city.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Hindustan Times Form */}
        {currentPaper.id === "hindustan-times" && (
          <>
            <div className="space-y-2 mb-5">
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Select Edition
              </label>
              <Select value={htCity} onValueChange={setHtCity} disabled={htLoading}>
                <SelectTrigger className="w-full h-12 bg-input border-border text-foreground">
                  <SelectValue placeholder={htLoading ? "Loading..." : "Choose edition"} />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border max-h-64">
                  {htEditions.map((ed) => (
                    <SelectItem key={ed.EditionId} value={String(ed.EditionId)} className="text-foreground hover:bg-muted focus:bg-muted">
                      {ed.EditionName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {htSubCities.length > 0 && (
              <div className="space-y-2 mb-5">
                <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  Select Supplement
                </label>
                <Select value={htSubCity} onValueChange={setHtSubCity}>
                  <SelectTrigger className="w-full h-12 bg-input border-border text-foreground">
                    <SelectValue placeholder="Choose supplement" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border max-h-64">
                    {htSubCities.map((sub) => (
                      <SelectItem key={sub.EditionId} value={String(sub.EditionId)} className="text-foreground hover:bg-muted focus:bg-muted">
                        {sub.EditionDisplayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </>
        )}

        {/* Times of India Form */}
        {currentPaper.id === "times-of-india" && (
          <div className="space-y-2 mb-5">
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MapPin className="w-4 h-4" />
              Select City
            </label>
            <Select value={toiCity} onValueChange={setToiCity}>
              <SelectTrigger className="w-full h-12 bg-input border-border text-foreground">
                <SelectValue placeholder="Choose your city" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border max-h-64">
                {toiCities.map((city) => (
                  <SelectItem key={city.slug} value={city.slug} className="text-foreground hover:bg-muted focus:bg-muted">
                    {city.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Date Picker - Common */}
        <div className="space-y-2 mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Select Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={maxDate}
            className="w-full h-12 px-4 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        {/* Download Button */}
        <Button
          type="submit"
          disabled={isLoading || !date || (currentPaper.id === "hindustan-times" && htLoading)}
          className="w-full h-14 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground glow-primary transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 spinner" />
              Fetching Pages...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Download E-Paper
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
