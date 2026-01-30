import { ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

interface PageScrollProps {
  pages: string[];
  onBack: () => void;
}

export function PageScroll({ pages, onBack }: PageScrollProps) {
  const [zoom, setZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));

  const scrollToPage = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const pageElements = container.querySelectorAll("[data-page]");
    if (pageElements[index]) {
      pageElements[index].scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrentPage(index);
    }
  };

  const handleScroll = () => {
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 glass-card border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-foreground hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              Page <span className="gradient-text">{currentPage + 1}</span>
              <span className="text-muted-foreground"> / {pages.length}</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="text-foreground hover:bg-muted h-9 w-9"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground w-10 text-center">
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

      {/* Scrollable Pages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-auto px-4 py-6"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {pages.map((page, idx) => (
            <div
              key={idx}
              data-page={idx}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(idx * 0.1, 0.5)}s` }}
            >
              {/* Page Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Page <span className="gradient-text">{idx + 1}</span>
                  <span className="text-muted-foreground text-sm font-normal ml-2">
                    of {pages.length}
                  </span>
                </h3>
              </div>

              {/* Page Content */}
              <div
                className="glass-card rounded-xl overflow-hidden transition-transform duration-300"
                style={{ 
                  transform: `scale(${zoom})`, 
                  transformOrigin: "top center",
                  marginBottom: zoom > 1 ? `${(zoom - 1) * 100}%` : 0
                }}
              >
                <div
                  className="w-full"
                  dangerouslySetInnerHTML={{ __html: page }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 z-40 glass-card border-t border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => scrollToPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="h-10 px-4 border-border text-foreground hover:bg-muted disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          {/* Page dots - horizontal scroll */}
          <div className="flex items-center gap-1.5 max-w-[200px] overflow-x-auto scrollbar-none py-1">
            {pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToPage(idx)}
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
            onClick={() => scrollToPage(Math.min(pages.length - 1, currentPage + 1))}
            disabled={currentPage === pages.length - 1}
            className="h-10 px-4 border-border text-foreground hover:bg-muted disabled:opacity-40"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
