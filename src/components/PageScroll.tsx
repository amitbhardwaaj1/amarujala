import { useState, useRef, useCallback, useEffect } from "react";
import { useDrag } from "@use-gesture/react";
import { jsPDF } from "jspdf";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Rows3,
  Columns3,
  Hash,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { NewspaperId, newspapers } from "@/data/newspapers";

interface PageScrollProps {
  pages: string[];
  onBack: () => void;
  city?: string;
  date?: string;
  newspaper?: NewspaperId;
}

type ScrollMode = "vertical" | "horizontal";

export function PageScroll({ pages, onBack, city, date, newspaper = "amar-ujala" }: PageScrollProps) {
  const [zoom, setZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [scrollMode, setScrollMode] = useState<ScrollMode>("vertical");
  const [jumpToPage, setJumpToPage] = useState("");
  const [isJumpOpen, setIsJumpOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  // Handle browser back button - push state when component mounts
  useEffect(() => {
    // Push a state so back button doesn't close the window
    window.history.pushState({ viewingPages: true }, "");

    const handlePopState = (event: PopStateEvent) => {
      // User pressed back button, go back to form
      onBack();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onBack]);

  // Download all pages as PDF
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage();

        // Extract image src from HTML content
        const imgMatch = pages[i].match(/src=["']([^"']+)["']/);
        
        if (imgMatch && imgMatch[1]) {
          const imgSrc = imgMatch[1];
          
          // Load image and add to PDF
          const img = new Image();
          img.crossOrigin = "anonymous";
          
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              
              if (ctx) {
                ctx.drawImage(img, 0, 0);
                const imgData = canvas.toDataURL("image/jpeg", 0.9);
                
                // Calculate dimensions to fit page
                const imgRatio = img.width / img.height;
                const pageRatio = pageWidth / pageHeight;
                
                let finalWidth = pageWidth;
                let finalHeight = pageHeight;
                
                if (imgRatio > pageRatio) {
                  finalHeight = pageWidth / imgRatio;
                } else {
                  finalWidth = pageHeight * imgRatio;
                }
                
                const x = (pageWidth - finalWidth) / 2;
                const y = (pageHeight - finalHeight) / 2;
                
                pdf.addImage(imgData, "JPEG", x, y, finalWidth, finalHeight);
              }
              resolve();
            };
            img.onerror = () => reject(new Error(`Failed to load image for page ${i + 1}`));
            img.src = imgSrc;
          });
        }
      }

      const paperName = newspapers[newspaper]?.id || "epaper";
      const fileName = `${paperName}-${city || "edition"}-${date || new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);

      toast({
        title: "Download Complete! 📄",
        description: `${pages.length} pages saved as PDF`,
      });
    } catch (error) {
      console.error("PDF creation failed:", error);
      toast({
        title: "Download Failed",
        description: "Could not create PDF file",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));

  const goToPage = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(pages.length - 1, index));
      setCurrentPage(clampedIndex);

      if (scrollMode === "vertical") {
        const container = scrollRef.current;
        if (!container) return;
        const pageElements = container.querySelectorAll("[data-page]");
        if (pageElements[clampedIndex]) {
          pageElements[clampedIndex].scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      } else {
        const container = horizontalRef.current;
        if (!container) return;
        container.scrollTo({
          left: clampedIndex * container.offsetWidth,
          behavior: "smooth",
        });
      }
    },
    [scrollMode, pages.length]
  );

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= pages.length) {
      goToPage(pageNum - 1);
      setIsJumpOpen(false);
      setJumpToPage("");
    }
  };

  const handleVerticalScroll = () => {
    if (scrollMode !== "vertical") return;
    const container = scrollRef.current;
    if (!container) return;
    const pageElements = container.querySelectorAll("[data-page]");
    let closestPage = 0;
    let minDistance = Infinity;

    pageElements.forEach((el, idx) => {
      const rect = el.getBoundingClientRect();
      const distance = Math.abs(rect.top - 100);
      if (distance < minDistance) {
        minDistance = distance;
        closestPage = idx;
      }
    });

    setCurrentPage(closestPage);
  };

  const handleHorizontalScroll = () => {
    if (scrollMode !== "horizontal") return;
    const container = horizontalRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const pageWidth = container.offsetWidth;
    const newPage = Math.round(scrollLeft / pageWidth);
    setCurrentPage(Math.max(0, Math.min(pages.length - 1, newPage)));
  };

  // Swipe gesture for horizontal mode
  const bind = useDrag(
    ({ direction: [dx], velocity: [vx], last }) => {
      if (scrollMode !== "horizontal" || !last) return;
      if (Math.abs(vx) > 0.2) {
        if (dx > 0) {
          goToPage(currentPage - 1);
        } else {
          goToPage(currentPage + 1);
        }
      }
    },
    { axis: "x", filterTaps: true }
  );

  const toggleMode = () => {
    setScrollMode((m) => (m === "vertical" ? "horizontal" : "vertical"));
    setZoom(1);
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 glass-card border-b border-border px-3 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-foreground hover:bg-muted h-9 px-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <div className="flex items-center gap-1.5">
            {/* Jump to page */}
            <Popover open={isJumpOpen} onOpenChange={setIsJumpOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:bg-muted h-9 px-2"
                >
                  <Hash className="w-4 h-4" />
                  <span className="ml-1 text-sm">
                    <span className="gradient-text font-semibold">{currentPage + 1}</span>
                    <span className="text-muted-foreground">/{pages.length}</span>
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-3" align="center">
                <form onSubmit={handleJumpSubmit} className="space-y-2">
                  <label className="text-sm text-muted-foreground">
                    Jump to page (1-{pages.length})
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={pages.length}
                      value={jumpToPage}
                      onChange={(e) => setJumpToPage(e.target.value)}
                      placeholder="Page #"
                      className="h-9"
                      autoFocus
                    />
                    <Button type="submit" size="sm" className="h-9 px-3">
                      Go
                    </Button>
                  </div>
                </form>
              </PopoverContent>
            </Popover>

            {/* Mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMode}
              className="text-foreground hover:bg-muted h-9 w-9"
              title={scrollMode === "vertical" ? "Switch to horizontal" : "Switch to vertical"}
            >
              {scrollMode === "vertical" ? (
                <Columns3 className="w-4 h-4" />
              ) : (
                <Rows3 className="w-4 h-4" />
              )}
            </Button>

            {/* Download PDF */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="text-foreground hover:bg-muted h-9 w-9"
              title="Download as PDF"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 spinner" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="text-foreground hover:bg-muted h-9 w-9"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground w-9 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoom >= 2}
              className="text-foreground hover:bg-muted h-9 w-9"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {scrollMode === "vertical" ? (
        /* Vertical Scroll */
        <div
          ref={scrollRef}
          onScroll={handleVerticalScroll}
          className="flex-1 overflow-auto px-4 py-6"
        >
          <div className="max-w-4xl mx-auto space-y-6">
            {pages.map((page, idx) => (
              <div
                key={idx}
                data-page={idx}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(idx * 0.08, 0.4)}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-foreground">
                    Page <span className="gradient-text">{idx + 1}</span>
                    <span className="text-muted-foreground text-sm font-normal ml-1">
                      / {pages.length}
                    </span>
                  </h3>
                </div>
                <div
                  className="glass-card rounded-xl overflow-hidden transition-transform duration-300 origin-top"
                  style={{
                    transform: `scale(${zoom})`,
                    marginBottom: zoom > 1 ? `${(zoom - 1) * 100}%` : 0,
                  }}
                >
                  <div className="w-full" dangerouslySetInnerHTML={{ __html: page }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Horizontal Scroll */
        <div
          ref={horizontalRef}
          onScroll={handleHorizontalScroll}
          {...bind()}
          className="flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory touch-pan-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex h-full" style={{ width: `${pages.length * 100}%` }}>
            {pages.map((page, idx) => (
              <div
                key={idx}
                data-page={idx}
                className="flex-shrink-0 h-full snap-center flex flex-col p-4"
                style={{ width: `${100 / pages.length}%` }}
              >
                <div className="text-center mb-3">
                  <span className="text-base font-semibold text-foreground">
                    Page <span className="gradient-text">{idx + 1}</span>
                    <span className="text-muted-foreground text-sm font-normal ml-1">
                      / {pages.length}
                    </span>
                  </span>
                </div>
                <div
                  className="flex-1 overflow-auto flex justify-center"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <div
                    className="glass-card rounded-xl overflow-hidden transition-transform duration-300 origin-top h-fit max-w-4xl w-full"
                    style={{ transform: `scale(${zoom})` }}
                  >
                    <div className="w-full" dangerouslySetInnerHTML={{ __html: page }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 z-40 glass-card border-t border-border px-3 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
            className="h-9 px-3 border-border text-foreground hover:bg-muted disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4 mr-0.5" />
            <span className="hidden sm:inline">Prev</span>
          </Button>

          {/* Page dots */}
          <div className="flex items-center gap-1 max-w-[180px] sm:max-w-[240px] overflow-x-auto scrollbar-none py-1">
            {pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToPage(idx)}
                className={`flex-shrink-0 w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentPage
                    ? "bg-primary w-5"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === pages.length - 1}
            className="h-9 px-3 border-border text-foreground hover:bg-muted disabled:opacity-40"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
