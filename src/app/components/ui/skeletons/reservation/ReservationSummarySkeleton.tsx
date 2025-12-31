const ReservationSummarySkeleton = () => {
  return (
    <div className="w-full 2xl:w-5/6 flex flex-col md:flex-row justify-center gap-2 animate-pulse">
      {/* LEFT SECTION */}
      <div className="w-full lg:w-[80%]">
        {/* Main Image */}
        <div className="aspect-video w-full mb-2 rounded-2xl bg-gray-200 relative">
          {/* Thumbnail */}
          <div className="absolute left-3 bottom-3 flex gap-4">
            <div className="w-[50px] aspect-video bg-gray-300 rounded-md" />
            <div className="w-[50px] aspect-video bg-gray-300 rounded-md" />
          </div>
        </div>

        {/* Room Info */}
        <div className="flex flex-col md:flex-row rounded-2xl bg-white border border-gray-200">
          <div className="p-4 w-full space-y-3">
            <div className="h-8 w-2/3 bg-gray-200 rounded" />
            <div className="h-5 w-1/3 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full">
        <div className="border border-gray-200 px-3 pt-5 pb-7 bg-white rounded-2xl">
          <table className="w-full mb-5">
            <tbody className="space-y-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <tr key={i} className="flex justify-between py-1">
                  <td className="h-4 w-1/3 bg-gray-200 rounded" />
                  <td className="h-4 w-1/4 bg-gray-300 rounded" />
                </tr>
              ))}
            </tbody>
          </table>

          {/* Button Skeleton */}
          <div className="h-12 w-full bg-gray-300 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default ReservationSummarySkeleton;
