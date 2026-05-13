"use client";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  label: string;
  field: string;
};

const SortButton = ({ label, field }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sortBy");
  const currentOrder = searchParams.get("sortOrder") ?? "desc";

  const isActive = currentSort === field;
  const nextOrder = isActive && currentOrder === "asc" ? "desc" : "asc";

  const handleSort = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", field);
    params.set("sortOrder", nextOrder);
    router.push(`?${params.toString()}`);
  };

  return (
    <button
      onClick={handleSort}
      className="flex items-center gap-1 hover:text-primary"
    >
      <p className="uppercase">{label}</p>
      {isActive ? (currentOrder === "asc" ? " ↑" : " ↓") : " ↕"}
    </button>
  );
};

export default SortButton;