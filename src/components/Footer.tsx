const resources = ["Find Jobs", "Post a Job", "Career Advice", "Help Center"];
const company = ["About Us", "Contact Us", "Privacy Policy", "Terms of Service"];
const socials = ["facebook", "share", "photo_camera", "work"];

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant">
      <div className="max-w-[1280px] mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-16">
          <div className="space-y-4">
            <div className="text-2xl font-extrabold text-primary tracking-tight">FastFoodJobs</div>
            <p className="text-base text-on-surface-variant">
              Connecting the food service industry with top talent. Find your flavor, build your career.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-on-surface uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link}>
                  <a href="#" className="text-base text-on-surface-variant hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-on-surface uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {company.map((link) => (
                <li key={link}>
                  <a href="#" className="text-base text-on-surface-variant hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-on-surface uppercase tracking-wider">Follow Us</h4>
            <div className="flex gap-4">
              {socials.map((icon) => (
                <a
                  key={icon}
                  href="#"
                  aria-label={icon}
                  className="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-on-surface-variant">
            &copy; 2024 FastFoodJobs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
