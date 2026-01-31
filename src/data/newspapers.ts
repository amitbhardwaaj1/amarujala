export interface Newspaper {
  id: string;
  name: string;
  shortName: string;
  color: string;
  apiEndpoint: string;
}

export const newspapers: Newspaper[] = [
  {
    id: "amarujala",
    name: "Amar Ujala",
    shortName: "AU",
    color: "#ff6b4a",
    apiEndpoint: "https://d39ihfvw4fm8k.cloudfront.net/dev/v2/download",
  },
  {
    id: "danikjagran",
    name: "Dainik Jagran",
    shortName: "DJ",
    color: "#e53935",
    apiEndpoint: "https://d39ihfvw4fm8k.cloudfront.net/dev/v2/download",
  },
  {
    id: "hindustantimes",
    name: "Hindustan Times",
    shortName: "HT",
    color: "#1565c0",
    apiEndpoint: "https://d39ihfvw4fm8k.cloudfront.net/dev/v2/download",
  },
  {
    id: "toi",
    name: "Times of India",
    shortName: "TOI",
    color: "#d32f2f",
    apiEndpoint: "https://d39ihfvw4fm8k.cloudfront.net/dev/v2/download",
  },
];

export function getNewspaperById(id: string): Newspaper | undefined {
  return newspapers.find((paper) => paper.id === id);
}
