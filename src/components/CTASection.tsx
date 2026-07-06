export default function CTASection() {
  return (
    <section className="bg-[#C0392B] py-16 md:py-20 px-5">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
          Ready to serve up something great?
        </h2>
        <p className="text-red-100 text-base">
          Join thousands of happy workers who found their perfect match on FastFoodJobs.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href="#"
            className="bg-white text-[#C0392B] font-semibold text-sm px-8 py-3 rounded-full hover:bg-red-50 transition-colors w-full sm:w-auto text-center"
          >
            Browse All Jobs
          </a>
          <a
            href="#"
            className="border-2 border-white text-white font-semibold text-sm px-8 py-3 rounded-full hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
          >
            For Employers
          </a>
        </div>
      </div>
    </section>
  );
}
