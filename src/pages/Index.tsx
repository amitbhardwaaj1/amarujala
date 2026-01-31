import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DownloadForm } from "@/components/DownloadForm";
import { PageScroll } from "@/components/PageScroll";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { NewspaperSwitcher } from "@/components/NewspaperSwitcher";
import { useEpaperDownload } from "@/hooks/useEpaperDownload";

const Index = () => {
  const [selectedPaper, setSelectedPaper] = useState("amarujala");
  const { isLoading, pages, progress, totalPages, city, date, newspaper, download, reset } = useEpaperDownload();

  const handleDownload = (city: string, date: string, paperType: string) => {
    download(city, date, paperType, selectedPaper);
  };

  const handleBack = () => {
    reset();
  };

  // Show scroll view when pages are loaded
  if (pages.length > 0) {
    return (
      <>
        <PageScroll pages={pages} onBack={handleBack} city={city} date={date} newspaper={newspaper} />
        {isLoading && totalPages > 0 && (
          <LoadingOverlay progress={progress} totalPages={totalPages} />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NewspaperSwitcher selectedPaper={selectedPaper} onSelect={setSelectedPaper} />
      <Header selectedPaper={selectedPaper} />

      <main className="flex-1 py-8 px-4">
        <div className="animate-fade-up">
          <div className="text-center mb-8">
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Select your city and date to download your daily newspaper
            </p>
          </div>
          <DownloadForm onDownload={handleDownload} isLoading={isLoading} selectedPaper={selectedPaper} />
        </div>
      </main>

      <Footer />

      {/* Loading Overlay */}
      {isLoading && totalPages > 0 && (
        <LoadingOverlay progress={progress} totalPages={totalPages} />
      )}
    </div>
  );
};

export default Index;
