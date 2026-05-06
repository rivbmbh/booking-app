import { getRoomAmenities } from '@/lib/data'
import AmenitiesTableClient from './AmenitiesTableClient'

const RoomAmenitiesTable = async () => {
  const amenities = await getRoomAmenities()

  if (!amenities?.length) return <p>No Amenities Found</p>

  return (
    <div className="bg-white p-4 mt-5 shadow-sm w-full overflow-auto">
      <AmenitiesTableClient
        amenities={amenities.map(a => ({
          id: a.id,
          name: a.name,
          createdAt: a.createdAt.toDateString(),
        }))}
      />
    </div>
  )
}

export default RoomAmenitiesTable