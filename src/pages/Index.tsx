import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DownloadForm } from "@/components/DownloadForm";
import { PageGrid } from "@/components/PageGrid";
import { PagePreview } from "@/components/PagePreview";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useEpaperDownload } from "@/hooks/useEpaperDownload";

const Index = () => {
  const { isLoading, pages, progress, totalPages, download, reset } = useEpaperDownload();
  const [selectedPage, setSelectedPage] = useState<number | null>(null);

  const handleDownload = (city: string, date: string, paperType: string) => {
    download(city, date, paperType);
  };

  const handlePageClick = (index: number) => {
    setSelectedPage(index);
  };

  const handleClosePreview = () => {
    setSelectedPage(null);
  };

  const handleBack = () => {
    reset();
    setSelectedPage(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4">
        {pages.length === 0 ? (
          <div className="animate-fade-up">
            <div className="text-center mb-8">
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Select your city and date to download your daily newspaper
              </p>
            </div>
            <DownloadForm onDownload={handleDownload} isLoading={isLoading} />
          </div>
        ) : (
          <PageGrid pages={pages} onPageClick={handlePageClick} onBack={handleBack} />
        )}
      </main>

      <Footer />

      {/* Loading Overlay */}
      {isLoading && totalPages > 0 && (
        <LoadingOverlay progress={progress} totalPages={totalPages} />
      )}

      {/* Page Preview Modal */}
      {selectedPage !== null && (
        <PagePreview
          pages={pages}
          currentPage={selectedPage}
          onPageChange={setSelectedPage}
          onClose={handleClosePreview}
        />
      )}
    </div>
  );
};

export default Index;
