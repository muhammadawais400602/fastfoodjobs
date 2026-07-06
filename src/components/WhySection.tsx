export default function WhySection() {
  return (
    <section className="bg-[#EEF4EE] py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-start">
        {/* Left */}
        <div className="flex-1 space-y-5 pt-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why FastFoodJobs?</h2>
          <p className="text-gray-600 text-base max-w-sm">
            We&apos;ve reinvented the hiring process for the hospitality industry. No more long forms or waiting weeks for a callback.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-[#3B2A1A] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#2a1e12] transition-colors"
          >
            Create Your Profile
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Right – cards */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Quick Hiring */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900">Quick Hiring</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Get interviewed and hired in as little as 24 hours. Our &quot;Instant Connect&quot; feature puts you directly in touch with hiring managers.
            </p>
          </div>

          {/* Flexible Shifts */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900">Flexible Shifts</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Filter jobs by availability. Find early morning, late night, or weekend-only shifts that perfectly match your lifestyle.
            </p>
          </div>

          {/* Career Growth – full width dark card */}
          <div className="sm:col-span-2 bg-[#3D5A80] rounded-2xl p-6 shadow-sm flex items-center gap-6">
            <div className="flex-1 space-y-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-bold text-white">Career Growth</h3>
              <p className="text-sm text-blue-100 leading-relaxed">
                Access exclusive training modules and management fast-track programs. We don&apos;t just find you a job; we help you build a career.
              </p>
            </div>
            <div className="hidden sm:block w-32 h-20 bg-white/10 rounded-xl shrink-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
