const CardSkeleton = () => {
  return (
    <div className="bg-white shadow-lg rounded-sm animate-pulse">
      <div className="h-[260px] w-auto rounded-t-sm bg-zinc-300"></div>
      <div className="p-8">
        <div className="mb-2">
          <div className="h-5 w-72 rounded bg-zinc-300"></div>
        </div>
        <div className="mb-7">
          <div className="h-6 w-32 rounded bg-zinc-300"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 rounded-full bg-zinc-300"></div>
            <span className="">
              <div className="h-5 w-12 rounded bg-zinc-300"></div>
            </span>
          </div>
          <div className="h-12 w-36 rounded-sm bg-zinc-300"></div>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
