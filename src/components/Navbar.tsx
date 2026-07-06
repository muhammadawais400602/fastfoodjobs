export default function Navbar() {
  return (
    <nav className="w-full bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100">
      <span className="text-[#8B1A1A] font-bold text-xl tracking-tight">FastFoodJobs</span>
      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-sm font-medium text-gray-800 border-b-2 border-[#8B1A1A] pb-0.5">Find Jobs</a>
        <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Post a Job</a>
        <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Login</a>
        <a
          href="#"
          className="bg-[#8B1A1A] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#701515] transition-colors"
        >
          Apply Now
        </a>
      </div>
    </nav>
  );
}
