export type JobOpening = {
  title: string;
  tag?: { label: string; style: "urgent" | "entry" };
  rate: string;
  schedule: string;
};

export type Profile = {
  slug: string;
  name: string;
  city: string;
  heroImage: string;
  logo: string;
  about: string[];
  amenities: { icon: string; label: string }[];
  jobs: JobOpening[];
  address: string[];
  phone: string;
  hours: { days: string; time: string }[];
};

const defaultAmenities = [
  { icon: "wifi", label: "Free Wi-Fi" },
  { icon: "time_to_leave", label: "Drive-thru" },
  { icon: "chair", label: "Indoor Seating" },
  { icon: "update", label: "24/7 Service" },
];

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBbAmwk8SavjZYbubcUaMoDolDQKjb_O8fGo2wTRt1cXgOYllxU3N2fLCCq-oM-IyAY705Q0izyPTTEkssnEK9iK8w7uTORo641JU0GZkoNUureOTbpeHvqgjaRhRUu8ImucGP4ITzuktXWntucIHNHbORsOleAwokaWagsbwMkFIsMzCqmUrGAHusEDeKsp2woScf65617lHQ_GwbWTroAgSjoIl051mLx7555W93yXcAqxaFAcpzzIEYE8MkWfP6fkzyhfOPXqnD9";

const BP_LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCvmoTx38yyYuzOvhveA5Np6D5J0hv06yzJBm5Az66mmVPh5-Qj0QX_0PQW5sdzvkHDeKYc-oy42TGPjD1QDkWiBVctDfHI67nglafEsvDK2hI6UcWFasHx8v5aCjfSHuO_gYapkcyz13YpOgI803ceur2LcRKAjF1QwZuvtZ_PfC1sumY1VmmdRjFYjQ9ZzOr-n1L8xwRjF5gP8UVf0CiqFxpjPcCUwmOPg6b5zdN-aFf3Z-zBpa5SHpo0HStdj6Wt_3GU6b9oclx2";

export const profiles: Profile[] = [
  {
    slug: "burger-palace",
    name: "Burger Palace",
    city: "Beverly Hills, CA",
    heroImage: HERO_IMG,
    logo: BP_LOGO,
    about: [
      "Welcome to the crown jewel of Beverly Hills fast-casual dining. Since 1998, Burger Palace has been a staple of the local community, serving up gourmet-style burgers with the speed and convenience of a quick-service restaurant. This branch isn't just about food; it's about people.",
      "We take immense pride in our commitment to the Beverly Hills neighborhood. From sourcing 100% organic local produce to hosting weekly charity events for the city's youth programs, we believe that a great business starts with a heart for its community. When you join our team, you're not just getting a job—you're becoming an ambassador for a brand that values quality, integrity, and local growth.",
    ],
    amenities: defaultAmenities,
    jobs: [
      { title: "Shift Manager", tag: { label: "Urgent Hire", style: "urgent" }, rate: "$24 - $28 / hr", schedule: "Full-Time" },
      { title: "Crew Member", tag: { label: "Entry Level", style: "entry" }, rate: "$18 - $20 / hr", schedule: "Part-Time" },
      { title: "Cashier", rate: "$17 - $19 / hr", schedule: "Flexible" },
    ],
    address: ["455 N Canon Dr,", "Beverly Hills, CA 90210"],
    phone: "(310) 555-0198",
    hours: [
      { days: "Mon - Fri", time: "24 Hours" },
      { days: "Saturday", time: "24 Hours" },
      { days: "Sunday", time: "6AM - 11PM" },
    ],
  },
  {
    slug: "taco-tectonic",
    name: "Taco Tectonic",
    city: "Beverly Hills, CA",
    heroImage: HERO_IMG,
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvkEQb1FVSiJKTimjAzVJIBHnXc4clBn5BZPI880Y35NKjcqnQg3e3T3kF4PyTKDnqdKDUuDiud1Vjvj1h6hr1LyiyVknhL3MtBf68z_MYwoeAUKC3cPMp63SvrVAyhxc_8ApSQHfimlDkmp8gvEUz-L0povvGpA8sSxgguoXBaFJyFHjWVSk6UTvUXpvw2gaUCAYBuihvipC-FPMNkEzjZLN-sx5IED0m_MBhww7aDtLRD9xmbR3ivW5DiDl8Xxigb551pprJFkk7",
    about: [
      "Modern fast-casual dining near Rodeo Drive. We pride ourselves on locally sourced ingredients and a fast-paced kitchen rhythm.",
      "Our team culture is built on energy and craft. Join a kitchen where every shift ends with pride in the plates you served and the people you served them with.",
    ],
    amenities: defaultAmenities,
    jobs: [
      { title: "Line Cook", tag: { label: "Urgent Hire", style: "urgent" }, rate: "$19 - $23 / hr", schedule: "Full-Time" },
      { title: "Cashier", tag: { label: "Entry Level", style: "entry" }, rate: "$17 - $20 / hr", schedule: "Part-Time" },
      { title: "Prep Crew", rate: "$17 - $22 / hr", schedule: "Flexible" },
    ],
    address: ["310 Rodeo Dr,", "Beverly Hills, CA 90210"],
    phone: "(310) 555-0142",
    hours: [
      { days: "Mon - Fri", time: "10AM - 11PM" },
      { days: "Saturday", time: "10AM - 1AM" },
      { days: "Sunday", time: "11AM - 10PM" },
    ],
  },
  {
    slug: "morning-crust",
    name: "Morning Crust",
    city: "Santa Monica, CA",
    heroImage: HERO_IMG,
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXlBvRkKH0xi7Am4cXkgrFHcblhVtTlp2MqDUMZZ-PwjrpAYwk8epQpOX47_Fk6S7bHIrwHo--ETn4DJd7YkM9DVSJ3WxRHlkEUkqn63M7JUpW4ewuKyzcZ2CsrWvFewlEf7aQh9DZ6ki0VMIE4-z_PNMQObyW5mqRWnGoWCpRaZbx3UY9tJziejWaHeQ8IKR9COAixLEwFU2Kz22kUXO_cw3Mnr7bGOAW7qYHiMvH0dGIT3b7OLQ7bT3WP3gxf0U1jbexEiqP-Dls",
    about: [
      "A bustling bakery and cafe known for the best sourdough in the zip code. Early morning shifts available for energetic baristas.",
      "We bake everything in-house from 4AM and serve a loyal neighborhood crowd all day. If you love the smell of fresh bread and fast, friendly service, you'll fit right in.",
    ],
    amenities: [
      { icon: "wifi", label: "Free Wi-Fi" },
      { icon: "local_cafe", label: "Espresso Bar" },
      { icon: "chair", label: "Indoor Seating" },
      { icon: "wb_sunny", label: "Early Shifts" },
    ],
    jobs: [
      { title: "Head Barista", tag: { label: "Urgent Hire", style: "urgent" }, rate: "$21 - $25 / hr", schedule: "Full-Time" },
      { title: "Baker's Assistant", tag: { label: "Entry Level", style: "entry" }, rate: "$19 - $22 / hr", schedule: "Early Morning" },
      { title: "Counter Staff", rate: "$18 - $21 / hr", schedule: "Part-Time" },
    ],
    address: ["2210 Santa Monica Blvd,", "Santa Monica, CA 90404"],
    phone: "(310) 555-0177",
    hours: [
      { days: "Mon - Fri", time: "5AM - 6PM" },
      { days: "Saturday", time: "6AM - 6PM" },
      { days: "Sunday", time: "6AM - 3PM" },
    ],
  },
  {
    slug: "pizza-express",
    name: "Pizza Express",
    city: "Los Angeles, CA",
    heroImage: HERO_IMG,
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqeCeY_TxKqS98lgb1UklgeO7S0LoH2bLeAjsLO269cVwVNQC97VEIhlAETQpj9rSiJRzk9ao1mIQMLrFZgSTOOvZfg29MDyLHUTbBH-yFyRzH9i9rXcZxnlrE4dmy7o5x4UxFi-GUK7LZ-zw-gDvJQ5uat-KRC4Bp62qRYCunH-fvNV77m9YSrfqrXf2cAy_rb-3R7dgNKcnzn6ftWxHm_6BP1heEYYIQ6m1F-6bZ3MrcPwpzC4xkSQbeRgMupp1KNRa4-_4xw1WI",
    about: [
      "Busy delivery and takeout hub. Seeking reliable drivers and kitchen staff for the weekend rush in a friendly, high-paced store.",
      "Weekend nights here move fast — and so do promotions. Many of our store managers started as drivers. Bring hustle and we'll bring the training.",
    ],
    amenities: [
      { icon: "local_shipping", label: "Delivery Hub" },
      { icon: "time_to_leave", label: "Drive-thru" },
      { icon: "schedule", label: "Late Nights" },
      { icon: "payments", label: "Weekly Pay" },
    ],
    jobs: [
      { title: "Delivery Driver", tag: { label: "Urgent Hire", style: "urgent" }, rate: "$16 - $20 / hr + tips", schedule: "Flexible" },
      { title: "Kitchen Staff", tag: { label: "Entry Level", style: "entry" }, rate: "$17 - $19 / hr", schedule: "Part-Time" },
    ],
    address: ["8455 Olympic Blvd,", "Los Angeles, CA 90035"],
    phone: "(323) 555-0126",
    hours: [
      { days: "Mon - Fri", time: "11AM - 12AM" },
      { days: "Saturday", time: "11AM - 2AM" },
      { days: "Sunday", time: "11AM - 11PM" },
    ],
  },
];

export function getProfile(slug: string) {
  return profiles.find((p) => p.slug === slug);
}
