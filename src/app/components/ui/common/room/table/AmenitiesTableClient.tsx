"use client"

import { useState, useTransition } from 'react'
import { formatDate } from '@/lib/utils'
import { IoPencilOutline, IoTrashOutline } from 'react-icons/io5'
import { deleteAmenities } from '@/lib/action'
import Swal from 'sweetalert2'
import ModalEditAmenities from '../form/ModalEditAmenities'

type Amenity = {
    id: string
    name: string
    createdAt: string
}

const AmenitiesTableClient = ({ amenities }: { amenities: Amenity[] }) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [isPending, startTransition] = useTransition()
    const [editTarget, setEditTarget] = useState<{ id: string; name: string } | null>(null)
    const isAllSelected = amenities.length > 0 && selectedIds.size === amenities.length
    const isIndeterminate = selectedIds.size > 0 && selectedIds.size < amenities.length

    const toggleAll = () => {
        if (isAllSelected) {
        setSelectedIds(new Set())
        } else {
        setSelectedIds(new Set(amenities.map(a => a.id)))
        }
    }

    const toggleOne = (id: string) => {
        setSelectedIds(prev => {
        const next = new Set(prev)
        next.has(id) ? next.delete(id) : next.add(id)
        return next
        })
    }

    const handleDelete = (ids: string[]) => {
        const isBulk = ids.length > 1

        Swal.fire({
            title: 'Are you sure?',
            text: isBulk
                ? `You are about to delete ${ids.length} amenities. This action cannot be undone.`
                : 'You are about to delete this amenity. This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: isBulk ? `Yes, delete ${ids.length} items` : 'Yes, delete it',
            cancelButtonText: 'Cancel',
        }).then(result => {
            if (!result.isConfirmed) return

            startTransition(async () => {
            const res = await deleteAmenities(ids)
            if (res?.success) {
                setSelectedIds(new Set())
                Swal.fire({
                    title: 'Deleted!',
                    text: isBulk
                    ? `${ids.length} amenities have been deleted successfully.`
                    : 'The amenity has been deleted successfully.',
                    icon: 'success',
                    confirmButtonColor: '#3b82f6',
                    timer: 2000,
                    timerProgressBar: true,
                })
            } else {
                Swal.fire({
                    title: 'Failed!',
                    text: res?.error ?? 'Something went wrong. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#3b82f6',
                })
            }
        })
        })
    }

    const handleOpenEdit = (amenity: { id: string; name: string }) => {
        setEditTarget(amenity)
        // Tunggu state terupdate dulu baru buka modal
        setTimeout(() => {
        document.getElementById('modal-amenities-edit')?.showPopover()
        }, 0)
    }

    return (
        <>
        {editTarget && (
            <ModalEditAmenities
            key={editTarget.id}
            id={editTarget.id}
            name={editTarget.name}
            />
        )}
        {/* Toolbar bulk delete */}
        {selectedIds.size > 0 && (
            <div className="flex items-center justify-between mb-3 px-2 py-2">
            <span className="text-sm text-gray-900">
                {selectedIds.size} items selected
            </span>
            <button
                onClick={() => handleDelete([...selectedIds])}
                disabled={isPending}
                className="rounded-sm p-1 hover:bg-primary-hover cursor-pointer disabled:opacity-50 flex justify-between items-center gap-3 w-max px-3 py-2.5 bg-primary text-white"
            >
                <IoTrashOutline className="size-4" />
                {isPending ? 'Deleting...' : 'Delete Selection'}
            </button>
            </div>
        )}

        <table className="w-full divide-y divide-gray-200">
            <thead>
            <tr>
                {/* Kolom checkbox */}
                <th className="px-4 py-3 w-10">
                <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={el => { if (el) el.indeterminate = isIndeterminate }}
                    onChange={toggleAll}
                    className="cursor-pointer w-4 h-4"
                />
                </th>
                <th className="px-6 py-3 text-sm font-bold text-gray-700 uppercase text-left">
                Name
                </th>
                <th className="px-6 py-3 text-sm font-bold text-gray-700 uppercase text-left">
                Created at
                </th>
                <th className="px-6 py-3 text-sm font-bold text-gray-700 uppercase">
                Action
                </th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {amenities.map(amenity => {
                const isSelected = selectedIds.has(amenity.id)
                return (
                <tr
                    key={amenity.id}
                    className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-red-50 border border-red-100' : ''}`}
                >
                    <td className="px-4 py-4">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(amenity.id)}
                        className="cursor-pointer w-4 h-4"
                    />
                    </td>
                    <td className="px-6 py-4">{amenity.name}</td>
                    <td className="px-6 py-4">{formatDate(amenity.createdAt)}</td>
                    <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-1.5">
                        <button
                            onClick={() => handleOpenEdit({ id: amenity.id, name: amenity.name })}
                            className="rounded-sm p-1 hover:bg-gray-200 cursor-pointer"
                        >
                        <IoPencilOutline className="size-5" />
                        </button>
                        {/* Delete single */}
                        <button
                        onClick={() => handleDelete([amenity.id])}
                        disabled={isPending}
                        className="rounded-sm p-1 hover:bg-gray-200 cursor-pointer disabled:opacity-50 text-red-500"
                        >
                        <IoTrashOutline className="size-5" />
                        </button>
                    </div>
                    </td>
                </tr>
                )
            })}
            </tbody>
        </table>
        </>
    )
}

export default AmenitiesTableClient