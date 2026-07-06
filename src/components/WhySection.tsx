const CAREER_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDZp3DqZ0awQ5Rvv3lYi7agB2M3t-zz9yhe5U7W5UrG5mZAq78gmnAcl6KV97UefO3OKZyPuJqNlYqk2Q1EHARIjt7ReZ9NPuUVyFNhxUGwur3iodJB4kJpxMws7dTHssELujfiy7AbOha8JdI8f6QbnVLJ7NKLaJBpVyYPHmF9XcAmrmsnhvN6Qz_jRiZN-ky_Jg9Jxewt3LynYoh8fQnNERS77fD0TV9PIaGw_pXmx0I0hd7fWHAG60KjZt_46K0hPZ_E_n8mBTMu";

export default function WhySection() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left */}
          <div className="lg:col-span-5">
            <h2 className="font-extrabold text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.1] tracking-[-0.02em] text-on-surface mb-6">
              Why FastFoodJobs?
            </h2>
            <p className="text-lg leading-relaxed text-on-surface-variant mb-10">
              We&apos;ve reinvented the hiring process for the hospitality industry. No more long forms or waiting weeks for a callback.
            </p>
            <button className="bg-secondary text-on-secondary px-8 py-4 rounded-xl text-sm font-semibold hover:brightness-110 transition-all inline-flex items-center gap-2">
              Create Your Profile <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

          {/* Right – bento cards */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Hiring */}
            <div className="bg-white p-8 rounded-[24px] shadow-[0px_4px_20px_rgba(29,53,87,0.05)] border border-outline-variant/5 group hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-primary-fixed rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined icon-filled text-primary text-[32px]">bolt</span>
              </div>
              <h3 className="text-2xl font-bold leading-snug text-on-surface mb-3">Quick Hiring</h3>
              <p className="text-base text-on-surface-variant">
                Get interviewed and hired in as little as 24 hours. Our &quot;Instant Connect&quot; feature puts you directly in touch with hiring managers.
              </p>
            </div>

            {/* Flexible Shifts */}
            <div className="bg-white p-8 rounded-[24px] shadow-[0px_4px_20px_rgba(29,53,87,0.05)] border border-outline-variant/5 group hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-secondary-fixed rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined icon-filled text-secondary text-[32px]">calendar_today</span>
              </div>
              <h3 className="text-2xl font-bold leading-snug text-on-surface mb-3">Flexible Shifts</h3>
              <p className="text-base text-on-surface-variant">
                Filter jobs by availability. Find early morning, late night, or weekend-only shifts that perfectly match your lifestyle.
              </p>
            </div>

            {/* Career Growth – full width */}
            <div className="md:col-span-2 bg-tertiary-container text-on-tertiary-container p-8 rounded-[24px] shadow-[0px_4px_20px_rgba(29,53,87,0.05)] flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined icon-filled text-white text-[32px]">trending_up</span>
                </div>
                <h3 className="text-2xl font-bold leading-snug mb-3">Career Growth</h3>
                <p className="text-base opacity-90">
                  Access exclusive training modules and management fast-track programs. We don&apos;t just find you a job; we help you build a career.
                </p>
              </div>
              <div className="flex-1 w-full h-48 bg-white/10 rounded-xl overflow-hidden relative border border-white/10">
                <img
                  className="w-full h-full object-cover opacity-80"
                  alt="Career progression path from team member to manager"
                  src={CAREER_IMG}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tertiary-container to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
