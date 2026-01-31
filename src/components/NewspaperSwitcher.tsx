import { useState } from "react";
import { Newspaper, ChevronDown } from "lucide-react";
import { newspapers, type Newspaper as NewspaperType } from "@/data/newspapers";
import { cn } from "@/lib/utils";

interface NewspaperSwitcherProps {
  selectedPaper: string;
  onSelect: (paperId: string) => void;
}

export function NewspaperSwitcher({ selectedPaper, onSelect }: NewspaperSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentPaper = newspapers.find((p) => p.id === selectedPaper) || newspapers[0];

  const handleSelect = (paper: NewspaperType) => {
    onSelect(paper.id);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        {/* Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background/80 backdrop-blur-md border border-border/50 shadow-lg hover:bg-background/90 transition-all duration-300 group"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md transition-transform group-hover:scale-105"
            style={{ backgroundColor: currentPaper.color }}
          >
            {currentPaper.shortName}
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <div className="absolute right-0 top-full mt-2 z-50 min-w-[200px] rounded-xl bg-background/95 backdrop-blur-md border border-border/50 shadow-2xl overflow-hidden animate-scale-in">
              <div className="p-2">
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <Newspaper className="w-3.5 h-3.5" />
                  Select Newspaper
                </div>
                
                <div className="space-y-1 mt-1">
                  {newspapers.map((paper) => (
                    <button
                      key={paper.id}
                      onClick={() => handleSelect(paper)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                        selectedPaper === paper.id
                          ? "bg-primary/10 text-foreground"
                          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm"
                        style={{ backgroundColor: paper.color }}
                      >
                        {paper.shortName}
                      </div>
                      <span className="font-medium">{paper.name}</span>
                      {selectedPaper === paper.id && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
