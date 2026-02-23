import { deleteRoom, deleteRoomType } from "@/lib/action";
import Link from "next/link";
import { IoPencilOutline, IoTrashOutline } from "react-icons/io5";


export const EditButton = ({ id, url }: { id: string, url: string }) => {
  return (
    <Link
      href={`${url}/${id}`}
      className="rounded-sm p-1 hover:bg-gray-200"
    >
      <IoPencilOutline className="size-5" />
    </Link>
  );
};

type DeleteButtonProps = {
  id: string;
  image?: string;
};

export const DeleteButton = ({ id, image }: DeleteButtonProps) => {
  const DeleteRoom = deleteRoom.bind(null, id);
  const DeleteRoomType = deleteRoomType.bind(null, id, image as string);
  const deleteAction = image ? DeleteRoomType : DeleteRoom;
return (
    <form action={deleteAction}>
      <button
        type="submit"
        className="rounded-sm p-1 hover:bg-gray-200 cursor-pointer"
      >
        <IoTrashOutline className="size-5" />
      </button>
    </form>
  );
};
