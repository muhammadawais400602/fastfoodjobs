import type { Restaurant } from "@/data/restaurants";

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="flex-shrink-0 w-[280px] sm:w-[320px] bg-white rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
      <div className="h-48 overflow-hidden relative">
        <img
          alt={`${restaurant.name} Restaurant`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={restaurant.photo}
        />
        <div className="absolute top-4 right-4 bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold">
          {restaurant.openRoles} Open Roles
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <img
            alt={`${restaurant.name} Logo`}
            className="w-8 h-8 rounded-full border border-outline-variant/20"
            src={restaurant.logo}
          />
          <h3 className="text-2xl font-bold leading-snug text-on-surface">{restaurant.name}</h3>
        </div>
        <p className="text-base text-on-surface-variant mb-6 line-clamp-2">{restaurant.description}</p>
        <button className="w-full py-3 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-all">
          View Jobs
        </button>
      </div>
    </div>
  );
}
