const brands = [
  {
    name: "Burger Hub",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdu9pI42Zzr7Y5k-nXybGdP0fwfO0gbBBe5rVFEes5ooaJ2CeiMXOA_CHC3srXw0qNgzKRjFOs2QuRq87T_54DblkthmWK2ymoF255kIimPkqvEOxOcYzsDhiBA9qY16qcNQQaNvfy5hD2y9W2FT5vWec4mhUNrpq6VbWS0Mbhmlq-sZic2ps_iSHwF0sIfyjHJB2j-YONi_dE3VhA2vz4NtOhxO4ZS8TFJoC_c5gbBp7cdUTpDyv_VDt7SxlP2_ijJjGsN3dhQwlb",
  },
  {
    name: "Cluckers",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrUfu8Mr6VeElbvf8adZB_s1g1Q7RWrtC_JcM7OfS9Ls6xmtcMbDfPWSdB_I65lR5NjMACCSVhIQSsZk228dhUaYUFWIGzpI162RJP_gREzwQ9QopjDBTr00P_Zcr2j1eKsQ7TYSWntXN9MqJ5b6r3emuemE64Kg-vHkCZCFUitqJMQzNt3sgXNbD-XtfZRbPt1QUH7lFZ1jSrAVBPrVWQM-dmRZ0S7urb3Z7LbhBesX2tkQbrdrC3Sba4XH2lg-Kju4svD424DpB_",
  },
  {
    name: "Taco Tides",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEQQLZSCMWWLepUTKpEePM3PFbNtScS3Lzg0RQKGbWGcQ0HyaxLhQGImBxZTyWAYoQwQ1SWZ0sRB5n0L_NjKCJUzPkpilFr36nvmemp3HWDZ0ImpHaMlVsYhVT1Ae1bZQGyUrhmWKTj7F8axFzztCW5q7peFkdRXGLgMhuZIRCkg-2m56TJkb1FguHU119NedH7ScTnHWmaCjo9YICh7elGzMbaczgmEvrwzDRIKRl_OVnFKBaldAK8l77e0Ahb9Bka_o7p0pT2Cto",
  },
  {
    name: "Crust & Co",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0oAdegp2qsKjr00jhgkxZ90HhGkY2C20tz0wdlB7Q6a7eEZpUEhMJ7bIqtKc_fAAKRux--VNl0g-foxQryXSZPfQGxbpnrowvpBhLHl26zxa9CrUxdddmd9tIGJQ8NerTF5bgmPKT9Ww1bviShsL6kbKx11z6j-C3uEHb3rAihsDfI6SjL0YfuyeOCp1a-E0-cW6HbLaXaA32TQPjxCUN_fkVkt2dLWSNGl1CQIBLB3STHTCSzObTK7oJlR1qYUc79nOEYJQ_U-C6",
  },
  {
    name: "Glaze & Bean",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtGA6jaruzMRAzCzo83wVZCILFxJbumrtWGtK41oOigcGw7OaCplxAtsucEuq_TwPiTppUsYw2bHgzhKQ7HeTmoCQ0GbYAPefuz9ekx1_e8AvpaFCuXXQKahvXP0hYxNm6F7uqP7ft-UNrjBVS2OvaS72k6mgI6uHn-KTnH5drMhEsk31QX054YuoFDfs4S0nxnN2O_EeT5ZDZATjej_V6GTD-i-87Q6Zdn5bncNI91-yfXd1rqiOqz2AS3TnlETB8vhAopuyPaEYH",
  },
  {
    name: "Fresh Greens",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTRBxkTEai8jcmYVj4XEJbFNkc9GTP7J1WnG_izRG_WBl8WnS1Vh5t14OD8ZhngUg8jNFnAM3RX8Qhmarzmw8ypqxfmny1PzXBjTHZJ0R3AlOwng7cDEiexj1R6r9iBq4bgP8zmX2sCorcInOfVQm5qEE6NdSPRfwlbGJb5MUjlEaXHd4CE_Tzd4J48bWdYVtJaYn5GqSCz-ykaOlnvcCPmg5UBF3t6DwfEvublB0_Pxeig4jZ9vBo-RIPeah7AGORb4cXiZR9SRD4",
  },
];

export default function FeaturedRestaurants() {
  return (
    <section className="py-16 md:py-20 bg-surface-container-lowest">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-[32px] font-bold leading-tight text-on-surface mb-1">
            Featured Restaurants
          </h2>
          <p className="text-base text-on-surface-variant">
            Start your career with these world-class franchise partners
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          {brands.map((brand) => (
            <div key={brand.name} className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow border border-outline-variant/10 overflow-hidden">
                <img className="w-12 h-12 object-contain" alt={`${brand.name} logo`} src={brand.src} />
              </div>
              <span className="text-sm font-semibold group-hover:text-primary transition-colors">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
