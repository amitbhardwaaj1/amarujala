import { Newspaper } from "lucide-react";

export function Header() {
  return (
    <header className="w-full py-6 px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10 glow-primary">
          <Newspaper className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          <span className="gradient-text">Amar Ujala</span>
          <span className="text-foreground ml-2">E-Paper</span>
        </h1>
      </div>
    </header>
  );
}
