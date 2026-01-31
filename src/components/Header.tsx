import { Newspaper } from "lucide-react";
import { getNewspaperById } from "@/data/newspapers";

interface HeaderProps {
  selectedPaper?: string;
}

export function Header({ selectedPaper = "amarujala" }: HeaderProps) {
  const paper = getNewspaperById(selectedPaper);
  const paperName = paper?.name || "Amar Ujala";

  return (
    <header className="w-full py-6 px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
        <div 
          className="p-2.5 rounded-xl glow-primary transition-colors duration-300"
          style={{ backgroundColor: `${paper?.color || 'hsl(var(--primary))'}20` }}
        >
          <Newspaper className="w-7 h-7" style={{ color: paper?.color || 'hsl(var(--primary))' }} />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          <span 
            className="bg-clip-text text-transparent bg-gradient-to-r transition-all duration-300"
            style={{ 
              backgroundImage: `linear-gradient(135deg, ${paper?.color || 'hsl(var(--primary))'}, ${paper?.color || 'hsl(var(--primary))'}aa)` 
            }}
          >
            {paperName}
          </span>
          <span className="text-foreground ml-2">E-Paper</span>
        </h1>
      </div>
    </header>
  );
}
