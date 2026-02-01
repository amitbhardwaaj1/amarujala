import { Newspaper } from "lucide-react";
import { useNewspaper } from "@/contexts/NewspaperContext";
import { NewspaperSwitcher } from "@/components/NewspaperSwitcher";

interface HeaderProps {
  onPaperChange?: () => void;
}

export function Header({ onPaperChange }: HeaderProps) {
  const { currentPaper } = useNewspaper();

  return (
    <header className="w-full py-6 px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 glow-primary">
            <Newspaper className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            <span className="gradient-text">{currentPaper.name}</span>
            <span className="text-foreground ml-2 text-base md:text-lg">E-Paper</span>
          </h1>
        </div>

        <NewspaperSwitcher onPaperChange={onPaperChange} />
      </div>
    </header>
  );
}
