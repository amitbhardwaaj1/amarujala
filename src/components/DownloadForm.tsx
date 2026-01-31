import { useState, useMemo, useEffect } from "react";
import { Calendar, MapPin, FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getOrderedCities, getNewspaperById } from "@/data/newspapers";

interface DownloadFormProps {
  onDownload: (city: string, date: string, paperType: string) => void;
  isLoading: boolean;
  selectedPaper: string;
}

export function DownloadForm({ onDownload, isLoading, selectedPaper }: DownloadFormProps) {
  const newspaper = useMemo(() => getNewspaperById(selectedPaper), [selectedPaper]);
  const cities = useMemo(() => newspaper ? getOrderedCities(newspaper) : [], [newspaper]);
  
  const [selectedCity, setSelectedCity] = useState(cities[0]?.slug || "");
  const [paperType, setPaperType] = useState("main");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  // Reset city when newspaper changes
  useEffect(() => {
    if (cities.length > 0) {
      setSelectedCity(cities[0].slug);
      setPaperType("main");
    }
  }, [selectedPaper, cities]);

  const hasMycity = useMemo(() => {
    if (!newspaper) return false;
    const city = newspaper.cities[selectedCity];
    return city?.is_mycity === "Y";
  }, [selectedCity, newspaper]);

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setPaperType("main");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      return;
    }
    onDownload(selectedCity, date, paperType);
  };

  const maxDate = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="glass-card rounded-2xl p-6 md:p-8 animate-scale-in">
        {/* City Select */}
        <div className="space-y-2 mb-5">
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <MapPin className="w-4 h-4" />
            Select City
          </label>
          <Select value={selectedCity} onValueChange={handleCityChange}>
            <SelectTrigger className="w-full h-12 bg-input border-border text-foreground">
              <SelectValue placeholder="Choose your city" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border max-h-64">
              {cities.map((city) => (
                <SelectItem
                  key={city.slug}
                  value={city.slug}
                  className="text-foreground hover:bg-muted focus:bg-muted"
                >
                  {city.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Paper Type Select */}
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

        {/* Date Picker */}
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
          disabled={isLoading || !date}
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
