const restaurants = ['Burger Hub', 'Cluckers', 'Taco Tides', 'Crust & Co', 'Glaze & Bean', 'Fresh Greens'];

export default function FeaturedRestaurants() {
  return (
    <section className="bg-white py-14 md:py-20 px-5">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Restaurants</h2>
        <p className="mt-2 text-gray-500 text-sm">Start your career with these world-class franchise partners</p>

        <div className="mt-10 grid grid-cols-3 sm:grid-cols-6 gap-6">
          {restaurants.map((name) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-xs text-gray-600 font-medium text-center leading-tight">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
