const footerLinks = ["Privacy Policy", "Terms of Service", "Contact Us", "About Us"];

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant">
      <div className="w-full py-12 px-6 max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="text-2xl font-extrabold text-primary tracking-tight">FastFoodJobs</div>
          <p className="text-xs font-bold text-on-surface-variant">
            &copy; 2024 FastFoodJobs. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {footerLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-all"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex gap-4">
          <a
            href="#"
            aria-label="Share"
            className="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
          </a>
          <a
            href="#"
            aria-label="Email"
            className="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">alternate_email</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
