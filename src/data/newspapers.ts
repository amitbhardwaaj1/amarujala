export interface City {
  title: string;
  slug: string;
  is_mycity: string | null;
}

export interface Newspaper {
  id: string;
  name: string;
  shortName: string;
  color: string;
  cities: Record<string, City>;
  specialOrder?: string[];
}

// Amar Ujala cities
const amarujalaCities: Record<string, City> = {
  "agra-city": { title: "Agra City", slug: "agra-city", is_mycity: "Y" },
  "agra-dehat": { title: "Agra Dehat", slug: "agra-dehat", is_mycity: "Y" },
  "mathura": { title: "Mathura", slug: "mathura", is_mycity: null },
  "hathras": { title: "Hathras", slug: "hathras", is_mycity: "Y" },
  "aligarh-city": { title: "Aligarh City", slug: "aligarh-city", is_mycity: null },
  "aligarh-dehat": { title: "Aligarh Dehat", slug: "aligarh-dehat", is_mycity: null },
  "ambala": { title: "Ambala", slug: "ambala", is_mycity: "Y" },
  "lucknow-city": { title: "Lucknow City", slug: "lucknow-city", is_mycity: "Y" },
  "meerut-city": { title: "Meerut City", slug: "meerut-city", is_mycity: "Y" },
  "noida": { title: "Noida", slug: "noida", is_mycity: "Y" },
  "varanasi-city": { title: "Varanasi City", slug: "varanasi-city", is_mycity: "Y" },
  "kanpur-city": { title: "Kanpur City", slug: "kanpur-city", is_mycity: "Y" },
  "ghaziabad": { title: "Ghaziabad", slug: "ghaziabad", is_mycity: "Y" },
  "haridwar": { title: "Haridwar", slug: "haridwar", is_mycity: "Y" },
  "dehradun-city": { title: "Dehradun City", slug: "dehradun-city", is_mycity: "Y" },
  "mohali": { title: "Mohali", slug: "mohali", is_mycity: "Y" },
  "sitapur": { title: "Sitapur", slug: "sitapur", is_mycity: "Y" },
  "sultanpur": { title: "Sultanpur", slug: "sultanpur", is_mycity: "Y" },
  "rishikesh": { title: "Rishikesh", slug: "rishikesh", is_mycity: "Y" },
  "bareilly": { title: "Bareilly", slug: "bareilly", is_mycity: null },
  "bijnor": { title: "Bijnor", slug: "bijnor", is_mycity: null },
  "moradabad": { title: "Moradabad", slug: "moradabad", is_mycity: null },
  "allahabad": { title: "Allahabad", slug: "allahabad", is_mycity: null },
};

// Dainik Jagran cities
const danikjagranCities: Record<string, City> = {
  "delhi": { title: "Delhi", slug: "delhi", is_mycity: "Y" },
  "lucknow": { title: "Lucknow", slug: "lucknow", is_mycity: "Y" },
  "kanpur": { title: "Kanpur", slug: "kanpur", is_mycity: "Y" },
  "varanasi": { title: "Varanasi", slug: "varanasi", is_mycity: "Y" },
  "agra": { title: "Agra", slug: "agra", is_mycity: "Y" },
  "allahabad": { title: "Allahabad", slug: "allahabad", is_mycity: "Y" },
  "gorakhpur": { title: "Gorakhpur", slug: "gorakhpur", is_mycity: "Y" },
  "meerut": { title: "Meerut", slug: "meerut", is_mycity: "Y" },
  "bareilly": { title: "Bareilly", slug: "bareilly", is_mycity: "Y" },
  "jaipur": { title: "Jaipur", slug: "jaipur", is_mycity: "Y" },
  "patna": { title: "Patna", slug: "patna", is_mycity: "Y" },
  "ranchi": { title: "Ranchi", slug: "ranchi", is_mycity: "Y" },
  "bhopal": { title: "Bhopal", slug: "bhopal", is_mycity: "Y" },
  "chandigarh": { title: "Chandigarh", slug: "chandigarh", is_mycity: "Y" },
  "dehradun": { title: "Dehradun", slug: "dehradun", is_mycity: "Y" },
};

// Hindustan Times cities
const hindustantimesCities: Record<string, City> = {
  "delhi": { title: "Delhi", slug: "delhi", is_mycity: null },
  "mumbai": { title: "Mumbai", slug: "mumbai", is_mycity: null },
  "lucknow": { title: "Lucknow", slug: "lucknow", is_mycity: null },
  "patna": { title: "Patna", slug: "patna", is_mycity: null },
  "ranchi": { title: "Ranchi", slug: "ranchi", is_mycity: null },
  "chandigarh": { title: "Chandigarh", slug: "chandigarh", is_mycity: null },
  "bhopal": { title: "Bhopal", slug: "bhopal", is_mycity: null },
  "jaipur": { title: "Jaipur", slug: "jaipur", is_mycity: null },
};

// Times of India cities
const toiCities: Record<string, City> = {
  "delhi": { title: "Delhi", slug: "delhi", is_mycity: null },
  "mumbai": { title: "Mumbai", slug: "mumbai", is_mycity: null },
  "bangalore": { title: "Bangalore", slug: "bangalore", is_mycity: null },
  "chennai": { title: "Chennai", slug: "chennai", is_mycity: null },
  "kolkata": { title: "Kolkata", slug: "kolkata", is_mycity: null },
  "hyderabad": { title: "Hyderabad", slug: "hyderabad", is_mycity: null },
  "pune": { title: "Pune", slug: "pune", is_mycity: null },
  "ahmedabad": { title: "Ahmedabad", slug: "ahmedabad", is_mycity: null },
  "lucknow": { title: "Lucknow", slug: "lucknow", is_mycity: null },
  "jaipur": { title: "Jaipur", slug: "jaipur", is_mycity: null },
};

export const newspapers: Newspaper[] = [
  {
    id: "amarujala",
    name: "Amar Ujala",
    shortName: "AU",
    color: "#ff6b4a",
    cities: amarujalaCities,
    specialOrder: ["agra-dehat", "agra-city", "mathura", "hathras"],
  },
  {
    id: "danikjagran",
    name: "Dainik Jagran",
    shortName: "DJ",
    color: "#e53935",
    cities: danikjagranCities,
  },
  {
    id: "hindustantimes",
    name: "Hindustan Times",
    shortName: "HT",
    color: "#1565c0",
    cities: hindustantimesCities,
  },
  {
    id: "toi",
    name: "Times of India",
    shortName: "TOI",
    color: "#d32f2f",
    cities: toiCities,
  },
];

export function getNewspaperById(id: string): Newspaper | undefined {
  return newspapers.find((paper) => paper.id === id);
}

export function getOrderedCities(newspaper: Newspaper): City[] {
  const all = Object.values(newspaper.cities);
  
  if (!newspaper.specialOrder) {
    return all.sort((a, b) => a.title.localeCompare(b.title, "hi"));
  }

  const specials: City[] = [];
  const remaining: City[] = [];

  for (const slug of newspaper.specialOrder) {
    const found = all.find((x) => x.slug === slug);
    if (found) specials.push(found);
  }

  all.forEach((c) => {
    if (!specials.some((s) => s.slug === c.slug)) remaining.push(c);
  });

  remaining.sort((a, b) => a.title.localeCompare(b.title, "hi"));

  return [...specials, ...remaining];
}
