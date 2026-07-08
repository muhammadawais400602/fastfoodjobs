// Client-safe restaurant profile types & constants (no database imports).

export const AMENITY_OPTIONS: { key: string; icon: string; label: string }[] = [
  { key: "wifi", icon: "wifi", label: "Free Wi-Fi" },
  { key: "drive_thru", icon: "time_to_leave", label: "Drive-thru" },
  { key: "indoor", icon: "chair", label: "Indoor Seating" },
  { key: "outdoor", icon: "deck", label: "Outdoor Seating" },
  { key: "always_open", icon: "update", label: "24/7 Service" },
  { key: "parking", icon: "local_parking", label: "Parking" },
  { key: "accessible", icon: "accessible", label: "Wheelchair Accessible" },
  { key: "delivery", icon: "local_shipping", label: "Delivery" },
];

export function amenityByKey(key: string) {
  return AMENITY_OPTIONS.find((a) => a.key === key);
}

export type RestaurantProfile = {
  name: string;
  tagline: string;
  cuisine: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  website: string;
  hours: string;
  logoUrl: string;
  coverUrl: string;
  amenities: string[];
  notifications: { newApplicants: boolean; interviewConfirmations: boolean; weeklyReports: boolean };
};

const DEFAULTS: RestaurantProfile = {
  name: "",
  tagline: "",
  cuisine: "Fast Casual",
  description: "",
  address: "",
  city: "",
  phone: "",
  website: "",
  hours: "",
  logoUrl: "",
  coverUrl: "",
  amenities: [],
  notifications: { newApplicants: true, interviewConfirmations: true, weeklyReports: false },
};

export function normalizeProfile(p: Partial<RestaurantProfile>, fallbackName: string): RestaurantProfile {
  return {
    name: p.name ?? fallbackName,
    tagline: p.tagline ?? "",
    cuisine: p.cuisine ?? DEFAULTS.cuisine,
    description: p.description ?? "",
    address: p.address ?? "",
    city: p.city ?? "",
    phone: p.phone ?? "",
    website: p.website ?? "",
    hours: p.hours ?? "",
    logoUrl: p.logoUrl ?? "",
    coverUrl: p.coverUrl ?? "",
    amenities: Array.isArray(p.amenities) ? p.amenities : [],
    notifications: { ...DEFAULTS.notifications, ...(p.notifications ?? {}) },
  };
}
