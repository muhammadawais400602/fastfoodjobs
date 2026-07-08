export type Restaurant = {
  name: string;
  openRoles: number;
  description: string;
  photo: string;
  logo: string;
};

export const restaurants: Restaurant[] = [
  {
    name: "Burger Hub",
    openRoles: 42,
    description: "The fastest-growing burger chain in the midwest. Join a team of flavor enthusiasts.",
    photo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBEv3_o89tW4Px4Lc3JpHzmiTTFkolQaZak4CiLI95klHrSgUCcqXo9n_4wWxi7NIMEEFcgBCjGFKefgvQApj_LufXQ6aVXoFryqCbfm-nioj6KeOmiOTXLc_-L2kLyrJbQWgMyN_dzGataENLhRmPcXiIkbvlBEdQ7NNk11I4b6HOniwsH4MgMO7X9hyRO4r__FLpNkjFfQZIDI9odHJY6sgAAjDkI-rQ_HXzSIzX6HInr3NsGVE7EdJZh9cbdJiKHXYqdduNSRlGf",
    logo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdu9pI42Zzr7Y5k-nXybGdP0fwfO0gbBBe5rVFEes5ooaJ2CeiMXOA_CHC3srXw0qNgzKRjFOs2QuRq87T_54DblkthmWK2ymoF255kIimPkqvEOxOcYzsDhiBA9qY16qcNQQaNvfy5hD2y9W2FT5vWec4mhUNrpq6VbWS0Mbhmlq-sZic2ps_iSHwF0sIfyjHJB2j-YONi_dE3VhA2vz4NtOhxO4ZS8TFJoC_c5gbBp7cdUTpDyv_VDt7SxlP2_ijJjGsN3dhQwlb",
  },
  {
    name: "Cluckers",
    openRoles: 18,
    description: "Crispy, juicy, and hiring! Become part of the family that serves the world's best chicken.",
    photo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrUfu8Mr6VeElbvf8adZB_s1g1Q7RWrtC_JcM7OfS9Ls6xmtcMbDfPWSdB_I65lR5NjMACCSVhIQSsZk228dhUaYUFWIGzpI162RJP_gREzwQ9QopjDBTr00P_Zcr2j1eKsQ7TYSWntXN9MqJ5b6r3emuemE64Kg-vHkCZCFUitqJMQzNt3sgXNbD-XtfZRbPt1QUH7lFZ1jSrAVBPrVWQM-dmRZ0S7urb3Z7LbhBesX2tkQbrdrC3Sba4XH2lg-Kju4svD424DpB_",
    logo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrUfu8Mr6VeElbvf8adZB_s1g1Q7RWrtC_JcM7OfS9Ls6xmtcMbDfPWSdB_I65lR5NjMACCSVhIQSsZk228dhUaYUFWIGzpI162RJP_gREzwQ9QopjDBTr00P_Zcr2j1eKsQ7TYSWntXN9MqJ5b6r3emuemE64Kg-vHkCZCFUitqJMQzNt3sgXNbD-XtfZRbPt1QUH7lFZ1jSrAVBPrVWQM-dmRZ0S7urb3Z7LbhBesX2tkQbrdrC3Sba4XH2lg-Kju4svD424DpB_",
  },
  {
    name: "Taco Tides",
    openRoles: 25,
    description: "Ride the wave of success. High-energy environment with flexible shifts for everyone.",
    photo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEQQLZSCMWWLepUTKpEePM3PFbNtScS3Lzg0RQKGbWGcQ0HyaxLhQGImBxZTyWAYoQwQ1SWZ0sRB5n0L_NjKCJUzPkpilFr36nvmemp3HWDZ0ImpHaMlVsYhVT1Ae1bZQGyUrhmWKTj7F8axFzztCW5q7peFkdRXGLgMhuZIRCkg-2m56TJkb1FguHU119NedH7ScTnHWmaCjo9YICh7elGzMbaczgmEvrwzDRIKRl_OVnFKBaldAK8l77e0Ahb9Bka_o7p0pT2Cto",
    logo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEQQLZSCMWWLepUTKpEePM3PFbNtScS3Lzg0RQKGbWGcQ0HyaxLhQGImBxZTyWAYoQwQ1SWZ0sRB5n0L_NjKCJUzPkpilFr36nvmemp3HWDZ0ImpHaMlVsYhVT1Ae1bZQGyUrhmWKTj7F8axFzztCW5q7peFkdRXGLgMhuZIRCkg-2m56TJkb1FguHU119NedH7ScTnHWmaCjo9YICh7elGzMbaczgmEvrwzDRIKRl_OVnFKBaldAK8l77e0Ahb9Bka_o7p0pT2Cto",
  },
  {
    name: "Crust & Co",
    openRoles: 31,
    description: "The art of the perfect pizza. Build your career from dough to director.",
    photo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA0oAdegp2qsKjr00jhgkxZ90HhGkY2C20tz0wdlB7Q6a7eEZpUEhMJ7bIqtKc_fAAKRux--VNl0g-foxQryXSZPfQGxbpnrowvpBhLHl26zxa9CrUxdddmd9tIGJQ8NerTF5bgmPKT9Ww1bviShsL6kbKx11z6j-C3uEHb3rAihsDfI6SjL0YfuyeOCp1a-E0-cW6HbLaXaA32TQPjxCUN_fkVkt2dLWSNGl1CQIBLB3STHTCSzObTK7oJlR1qYUc79nOEYJQ_U-C6",
    logo:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA0oAdegp2qsKjr00jhgkxZ90HhGkY2C20tz0wdlB7Q6a7eEZpUEhMJ7bIqtKc_fAAKRux--VNl0g-foxQryXSZPfQGxbpnrowvpBhLHl26zxa9CrUxdddmd9tIGJQ8NerTF5bgmPKT9Ww1bviShsL6kbKx11z6j-C3uEHb3rAihsDfI6SjL0YfuyeOCp1a-E0-cW6HbLaXaA32TQPjxCUN_fkVkt2dLWSNGl1CQIBLB3STHTCSzObTK7oJlR1qYUc79nOEYJQ_U-C6",
  },
];
