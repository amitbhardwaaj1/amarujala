import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-6 mt-auto">
      <div className="text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-1">
          © 2025 Amar Ujala Downloader • Developed with
          <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
          by Amit
        </p>
      </div>
    </footer>
  );
}
