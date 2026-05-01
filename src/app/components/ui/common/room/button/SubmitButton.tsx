import clsx from 'clsx'

const SubmitButton = ({isPending}: {isPending: boolean}) => {
  return (
     <button
        type="submit"
        className={clsx(
            "bg-primary text-white w-full hover:bg-primary-hover py-2.5 px-6 md:px-1 text-lg font-semibold cursor-pointer",
            {
            "opacity-50 cursor-progress": isPending,
            }
        )}
        disabled={isPending}
        >
        {isPending ? "Saving..." : "Save"}
    </button>
  )
}

export default SubmitButton