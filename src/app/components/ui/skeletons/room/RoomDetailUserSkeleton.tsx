const RoomDetailUserSkeleton = () => {
  return (
    <div className="max-w-screen-2xl py-16 px-4 grid lg:grid-cols-12 gap-8 mx-auto animate-pulse">
      {/* LEFT CONTENT */}
      <div className="md:col-span-8">
        {/* Image Gallery Skeleton */}
        <div className="w-full h-[400px] bg-zinc-300 mb-6"></div>

        {/* Title */}
        <div className="h-12 w-3/4 bg-zinc-300 mb-6"></div>

        {/* Description */}
        <div className="space-y-3 mb-6">
          <div className="h-4 bg-zinc-300 w-full"></div>
          <div className="h-4 bg-zinc-300 w-5/6"></div>
          <div className="h-4 bg-zinc-300 w-4/6"></div>
        </div>

        {/* Amenities Title */}
        <div className="h-6 w-40 bg-zinc-300 mb-4"></div>

        {/* Amenities Grid */}
        <div className="grid md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-zinc-300"></div>
              <div className="h-4 w-24 bg-zinc-300"></div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="md:col-span-4">
        <div className="border-2 border-dashed border-zinc-300 px-3 py-10 bg-zinc-300">
          {/* Capacity & Price */}
          <div className="flex items-center justify-between mb-8">
            <div className="h-4 w-24 bg-zinc-300"></div>
            <div className="h-6 w-28 bg-zinc-300"></div>
          </div>

          {/* Reservation Form Skeleton */}
          <div className="space-y-4">
            <div className="h-10 bg-zinc-300 w-full"></div>
            <div className="h-10 bg-zinc-300 w-full"></div>
            <div className="h-10 bg-zinc-300 w-full"></div>
            <div className="h-12 bg-zinc-300 w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailUserSkeleton;
