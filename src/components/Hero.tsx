export default function Hero() {
  return (
    <section className="bg-[#F5F3EE] px-5 py-12 md:py-20 lg:py-28">
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10 md:gap-12">

        {/* Left */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-xs font-semibold px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-orange-500 rounded-full inline-block"></span>
            1,200+ NEW JOBS POSTED TODAY
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Find Your Next{' '}
            <span className="text-[#C0392B] italic">Flavorful</span>
            <br />Career
          </h1>

          <p className="text-gray-600 text-base max-w-md mx-auto md:mx-0">
            From burger flippers to franchise directors. Connect with the biggest names in food service and start your journey today.
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row items-stretch bg-white rounded-2xl sm:rounded-full shadow-md border border-gray-200 overflow-hidden max-w-xl mx-auto md:mx-0">
            <div className="flex items-center gap-2 px-4 py-3 flex-1">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input className="outline-none text-sm text-gray-700 w-full placeholder-gray-400 bg-transparent" placeholder="Job title or keyword" />
            </div>
            <div className="hidden sm:block w-px bg-gray-200 h-8 self-center"></div>
            <div className="flex items-center gap-2 px-4 py-3 flex-1 border-t sm:border-t-0 border-gray-200">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input className="outline-none text-sm text-gray-700 w-full placeholder-gray-400 bg-transparent" placeholder="Enter Zip Code" />
            </div>
            <button className="bg-[#C0392B] text-white text-sm font-semibold px-6 py-3.5 hover:bg-[#a93226] transition-colors shrink-0">
              Search Jobs
            </button>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
            {['Quick Apply', 'Flexible Hours', 'No Resume Needed'].map((tag) => (
              <span key={tag} className="flex items-center gap-1.5 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right – image + badge */}
        <div className="flex-1 flex justify-center w-full">
          <div className="relative w-full max-w-[320px] sm:max-w-sm">
            <div className="rounded-3xl overflow-hidden shadow-xl bg-gray-200 aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80"
                alt="Fast food worker smiling"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Hired badge */}
            <div className="absolute bottom-5 -left-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 whitespace-nowrap">Hired in 48 hours!</p>
                <p className="text-xs text-gray-500">Sam J. at Burger Hub</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
