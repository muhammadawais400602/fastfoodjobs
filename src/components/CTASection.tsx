import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="bg-primary-container rounded-[32px] md:rounded-[40px] p-8 sm:p-12 md:p-20 text-center text-on-primary-container relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="font-extrabold text-[32px] sm:text-[40px] md:text-[48px] leading-[1.1] tracking-[-0.02em] max-w-2xl mx-auto">
              Ready to serve up something great?
            </h2>
            <p className="text-lg leading-relaxed opacity-90 max-w-xl mx-auto">
              Join thousands of happy workers who found their perfect match on FastFoodJobs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 pt-4">
              <Link
                href="/jobs"
                className="bg-white text-primary px-10 py-4 rounded-xl text-sm font-semibold hover:bg-surface transition-all shadow-lg"
              >
                Browse All Jobs
              </Link>
              <button className="bg-transparent border-2 border-white/30 text-white px-10 py-4 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all">
                For Employers
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
