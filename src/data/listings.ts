export type Listing = {
  slug: string;
  name: string;
  franchise: string;
  jobs: number;
  description: string;
  location: string;
  rate: string;
  logo: string;
};

export const listings: Listing[] = [
  {
    slug: "burger-palace",
    name: "Burger Palace",
    franchise: "Golden Grills Inc.",
    jobs: 5,
    description:
      "Located in the heart of Wilshire Blvd, specializing in gourmet-fast beef and vegan patties with a high-energy service environment.",
    location: "Beverly Hills, CA",
    rate: "$18 - $24 / hr",
    logo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCkghCK_tkzDyZP_GdX4SBoDbavjDS9r3byBEGGKMFEc1pK7BEGmXGucxxEPJehdf_uQese3yr1R7qQiN-2LUMzc7tdg0J5GanGfX84MqZaAf_VDSr4cLhbY1tbBM_Z0Vu7qooPCopGQ5EgRq-eOQVrVabGYP_sQOvB0hRnQ5GXvJQfBLlaFfOTXUnQDX-zA2HO9MFP8lZjnCljkrQu0J49Co9YTZhKkHiSnay2HA4r1a6sn9Bpc8zjXdYNaJCLA-3xPeKuWvcyqoTA",
  },
  {
    slug: "taco-tectonic",
    name: "Taco Tectonic",
    franchise: "SouthWest Eats LLC",
    jobs: 3,
    description:
      "Modern fast-casual dining near Rodeo Drive. We pride ourselves on locally sourced ingredients and a fast-paced kitchen rhythm.",
    location: "Beverly Hills, CA",
    rate: "$17 - $22 / hr",
    logo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDvkEQb1FVSiJKTimjAzVJIBHnXc4clBn5BZPI880Y35NKjcqnQg3e3T3kF4PyTKDnqdKDUuDiud1Vjvj1h6hr1LyiyVknhL3MtBf68z_MYwoeAUKC3cPMp63SvrVAyhxc_8ApSQHfimlDkmp8gvEUz-L0povvGpA8sSxgguoXBaFJyFHjWVSk6UTvUXpvw2gaUCAYBuihvipC-FPMNkEzjZLN-sx5IED0m_MBhww7aDtLRD9xmbR3ivW5DiDl8Xxigb551pprJFkk7",
  },
  {
    slug: "morning-crust",
    name: "Morning Crust",
    franchise: "Artisan Bakers Group",
    jobs: 8,
    description:
      "A bustling bakery and cafe known for the best sourdough in the zip code. Early morning shifts available for energetic baristas.",
    location: "Santa Monica Blvd",
    rate: "$19 - $25 / hr",
    logo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXlBvRkKH0xi7Am4cXkgrFHcblhVtTlp2MqDUMZZ-PwjrpAYwk8epQpOX47_Fk6S7bHIrwHo--ETn4DJd7YkM9DVSJ3WxRHlkEUkqn63M7JUpW4ewuKyzcZ2CsrWvFewlEf7aQh9DZ6ki0VMIE4-z_PNMQObyW5mqRWnGoWCpRaZbx3UY9tJziejWaHeQ8IKR9COAixLEwFU2Kz22kUXO_cw3Mnr7bGOAW7qYHiMvH0dGIT3b7OLQ7bT3WP3gxf0U1jbexEiqP-Dls",
  },
  {
    slug: "pizza-express",
    name: "Pizza Express",
    franchise: "Coastal Crust Corp.",
    jobs: 2,
    description:
      "Busy delivery and takeout hub. Seeking reliable drivers and kitchen staff for the weekend rush in a friendly, high-paced store.",
    location: "Olympic Blvd, LA",
    rate: "$16 - $20 / hr",
    logo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDqeCeY_TxKqS98lgb1UklgeO7S0LoH2bLeAjsLO269cVwVNQC97VEIhlAETQpj9rSiJRzk9ao1mIQMLrFZgSTOOvZfg29MDyLHUTbBH-yFyRzH9i9rXcZxnlrE4dmy7o5x4UxFi-GUK7LZ-zw-gDvJQ5uat-KRC4Bp62qRYCunH-fvNV77m9YSrfqrXf2cAy_rb-3R7dgNKcnzn6ftWxHm_6BP1heEYYIQ6m1F-6bZ3MrcPwpzC4xkSQbeRgMupp1KNRa4-_4xw1WI",
  },
];
