import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { NewspaperId } from "@/data/newspapers";

interface DownloadState {
  isLoading: boolean;
  pages: string[];
  progress: number;
  totalPages: number;
  city: string;
  date: string;
  newspaper: NewspaperId;
}

// API endpoints for each newspaper
const API_ENDPOINTS = {
  "amar-ujala": "https://d39ihfvw4fm8k.cloudfront.net/dev/v2/download",
  "dainik-jagran": "https://d3f65smzvvdjuh.cloudfront.net/dev/v1/download",
  "hindustan-times": "https://d2pntrmx20f4jl.cloudfront.net/dev/v1/download",
  "times-of-india": "https://d3a2dhpjvvj5q1.cloudfront.net/dev/v1/download",
  "hindustan": "https://d2it98gl4vzgmi.cloudfront.net/dev/v1/download",
};

export function useEpaperDownload() {
  const [state, setState] = useState<DownloadState>({
    isLoading: false,
    pages: [],
    progress: 0,
    totalPages: 0,
    city: "",
    date: "",
    newspaper: "amar-ujala",
  });

  const download = useCallback(
    async (
      newspaper: NewspaperId,
      city: string,
      date: string,
      paperType?: string,
      state?: string,
      subCity?: string
    ) => {
      setState({ isLoading: true, pages: [], progress: 0, totalPages: 0, city, date, newspaper });

      const [year, month, day] = date.split("-");

      try {
        let images: string[] = [];
        let totalPage = 1;

        if (newspaper === "amar-ujala") {
          // Amar Ujala - POST with pagination
          const firstResponse = await fetch(API_ENDPOINTS["amar-ujala"], {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ year, month, day, city, type: paperType || "main", page: "01" }),
          });
          const firstData = await firstResponse.json();

          if (!firstData.data || !firstData.data.totalPage) {
            throw new Error("Invalid response from server");
          }

          totalPage = parseInt(firstData.data.totalPage, 10) || 1;
          images.push(firstData.data.htmlContent);
          setState((s) => ({ ...s, progress: 1, totalPages: totalPage }));

          for (let i = 2; i <= totalPage; i++) {
            const pageNumber = i.toString().padStart(2, "0");
            const pageResponse = await fetch(API_ENDPOINTS["amar-ujala"], {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ year, month, day, city, type: paperType || "main", page: pageNumber }),
            });
            const pageData = await pageResponse.json();

            if (pageData.data?.htmlContent) {
              images.push(pageData.data.htmlContent);
            } else {
              images.push(`<div style="padding: 40px; text-align: center; color: #ff6b4a;">Page ${i} not available</div>`);
            }
            setState((s) => ({ ...s, progress: i }));
          }
        } else if (newspaper === "dainik-jagran") {
          // Dainik Jagran - GET, single response (all pages in one HTML)
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const monthName = months[parseInt(month) - 1];

          const response = await fetch(
            `${API_ENDPOINTS["dainik-jagran"]}?citySlug=${city}&day=${day}&month=${monthName}&year=${year}`,
            { method: "GET", headers: { "Content-Type": "application/json" } }
          );
          const data = await response.json();

          if (data?.data?.htmlContent) {
            // Parse the HTML to extract individual page images
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = data.data.htmlContent;
            const pageImages = tempDiv.querySelectorAll("img");

            if (pageImages.length > 0) {
              pageImages.forEach((img, idx) => {
                images.push(`<img src="${img.src}" alt="Page ${idx + 1}" style="width:100%;" />`);
              });
              totalPage = images.length;
            } else {
              images.push(data.data.htmlContent);
              totalPage = 1;
            }
          } else {
            throw new Error("No data returned from the API.");
          }
          setState((s) => ({ ...s, progress: totalPage, totalPages: totalPage }));
        } else if (newspaper === "hindustan-times") {
          // Hindustan Times - GET, single response with formatted date
          const formattedDate = `${day}/${month}/${year}`;
          const editionId = subCity || city;

          const response = await fetch(
            `${API_ENDPOINTS["hindustan-times"]}?editionId=${editionId}&editionDate=${formattedDate}`,
            { method: "GET", headers: { "Content-Type": "application/json" } }
          );
          const data = await response.json();

          if (data?.data?.htmlContent) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = data.data.htmlContent;
            const pageImages = tempDiv.querySelectorAll("img");

            if (pageImages.length > 0) {
              pageImages.forEach((img, idx) => {
                images.push(`<img src="${img.src}" alt="Page ${idx + 1}" style="width:100%;" />`);
              });
              totalPage = images.length;
            } else {
              images.push(data.data.htmlContent);
              totalPage = 1;
            }
          } else {
            throw new Error("No data returned from the API.");
          }
          setState((s) => ({ ...s, progress: totalPage, totalPages: totalPage }));
        } else if (newspaper === "times-of-india") {
          // Times of India - GET with pagination
          const firstResponse = await fetch(
            `${API_ENDPOINTS["times-of-india"]}?citySlug=${city}&day=${day}&month=${month}&year=${year}&page=1`,
            { method: "GET", headers: { "Content-Type": "application/json" } }
          );
          const firstData = await firstResponse.json();

          if (!firstData.data || !firstData.data.totalPage) {
            throw new Error("Invalid response");
          }

          totalPage = parseInt(firstData.data.totalPage, 10);
          images.push(firstData.data.htmlContent);
          setState((s) => ({ ...s, progress: 1, totalPages: totalPage }));

          for (let i = 2; i <= totalPage; i++) {
            const pageResponse = await fetch(
              `${API_ENDPOINTS["times-of-india"]}?citySlug=${city}&day=${day}&month=${month}&year=${year}&page=${i}`,
              { method: "GET", headers: { "Content-Type": "application/json" } }
            );
            const pageData = await pageResponse.json();

            if (pageData.data?.htmlContent) {
              images.push(pageData.data.htmlContent);
            }
            setState((s) => ({ ...s, progress: i }));
          }
        } else if (newspaper === "hindustan") {
          // Hindustan - GET, single response with formatted date
          const formattedDate = `${day}/${month}/${year}`;

          const response = await fetch(
            `${API_ENDPOINTS["hindustan"]}?editionId=${city}&editionDate=${formattedDate}`,
            { method: "GET", headers: { "Content-Type": "application/json" } }
          );
          const data = await response.json();

          if (data?.data?.htmlContent) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = data.data.htmlContent;
            const pageImages = tempDiv.querySelectorAll("img");

            if (pageImages.length > 0) {
              pageImages.forEach((img, idx) => {
                images.push(`<img src="${img.src}" alt="Page ${idx + 1}" style="width:100%;" />`);
              });
              totalPage = images.length;
            } else {
              images.push(data.data.htmlContent);
              totalPage = 1;
            }
          } else {
            throw new Error("No data returned from the API.");
          }
          setState((s) => ({ ...s, progress: totalPage, totalPages: totalPage }));
        }

        setState({ isLoading: false, pages: images, progress: totalPage, totalPages: totalPage, city, date, newspaper });
      } catch (error) {
        console.error("Download error:", error);
        setState({ isLoading: false, pages: [], progress: 0, totalPages: 0, city: "", date: "", newspaper: "amar-ujala" });

        toast({
          title: "Download Failed",
          description: "Please check your internet connection or try a different date/city.",
          variant: "destructive",
        });
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ isLoading: false, pages: [], progress: 0, totalPages: 0, city: "", date: "", newspaper: "amar-ujala" });
  }, []);

  return {
    ...state,
    download,
    reset,
  };
}
