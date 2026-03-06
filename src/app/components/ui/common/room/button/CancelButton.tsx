"use client"

export default function CancelButton() {
  return (
    <button
      onClick={(e) => {
        if (!confirm("Are you sure want to cancel this reservation?")) {
          e.preventDefault()
        }
      }}
       className="px-6 py-1 bg-primary text-white rounded-md hover:bg-primary-hover"
    >
      Cancel
    </button>
  )
}