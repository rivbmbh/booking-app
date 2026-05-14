import clsx from "clsx";

type Props = {
    grandPrice: string | null;
    isLoading: boolean;
};

const BookingSummary = ({ grandPrice, isLoading }: Props) => (
  <div className="px-8 pb-8 pt-4 flex flex-wrap justify-center sm:justify-between w-full">
    <div className="flex items-center text-md mb-4 sm:mb-0">
      <p className="font-semibold">Grand Total :</p>&nbsp;
      <p>{grandPrice || "Rp 0"}</p>
    </div>
    <button
      type="submit"
      disabled={isLoading}
      className={clsx("px-6 w-52 py-2 bg-primary text-white rounded-md hover:bg-primary-hover",
        { "opacity-50 cursor-progress": isLoading }
      )}
    >
      {isLoading ? "Loading..." : "Booking Now"}
    </button>
  </div>
);

export default BookingSummary;