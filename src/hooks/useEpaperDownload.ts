import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface DownloadState {
  isLoading: boolean;
  pages: string[];
  progress: number;
  totalPages: number;
  city: string;
  date: string;
}

export function useEpaperDownload() {
  const [state, setState] = useState<DownloadState>({
    isLoading: false,
    pages: [],
    progress: 0,
    totalPages: 0,
    city: "",
    date: "",
  });

  const download = useCallback(async (city: string, date: string, paperType: string) => {
    setState({ isLoading: true, pages: [], progress: 0, totalPages: 0, city, date });

    const [year, month, day] = date.split("-");

    try {
      // Fetch first page to get total count
      const firstResponse = await fetch("https://d39ihfvw4fm8k.cloudfront.net/dev/v2/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, month, day, city, type: paperType, page: "01" }),
      });

      const firstData = await firstResponse.json();

      if (!firstData.data || !firstData.data.totalPage) {
        throw new Error("Invalid response from server");
      }

      const totalPage = parseInt(firstData.data.totalPage, 10) || 1;
      const images: string[] = [firstData.data.htmlContent];

      setState((s) => ({ ...s, progress: 1, totalPages: totalPage }));

      // Fetch remaining pages
      for (let i = 2; i <= totalPage; i++) {
        const pageNumber = i.toString().padStart(2, "0");
        const pageResponse = await fetch("https://d39ihfvw4fm8k.cloudfront.net/dev/v2/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ year, month, day, city, type: paperType, page: pageNumber }),
        });

        const pageData = await pageResponse.json();

        if (pageData.data?.htmlContent) {
          images.push(pageData.data.htmlContent);
        } else {
          images.push(`<div style="padding: 40px; text-align: center; color: #ff6b4a;">Page ${i} not available</div>`);
        }

        setState((s) => ({ ...s, progress: i }));
      }

      setState({ isLoading: false, pages: images, progress: totalPage, totalPages: totalPage, city, date });

      toast({
        title: "E-Paper Loaded! 📰",
        description: `Successfully loaded ${totalPage} pages`,
      });
    } catch (error) {
      console.error("Download error:", error);
      setState({ isLoading: false, pages: [], progress: 0, totalPages: 0, city: "", date: "" });

      toast({
        title: "Download Failed",
        description: "Please check your internet connection or try a different date/city.",
        variant: "destructive",
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, pages: [], progress: 0, totalPages: 0, city: "", date: "" });
  }, []);

  return {
    ...state,
    download,
    reset,
  };
}
