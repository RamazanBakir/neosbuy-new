import { useEffect, useRef } from 'react'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function ContextMenu({ x, y, onClose, onEdit, onDelete }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="fixed bg-white shadow-lg rounded-lg py-1 z-50 border border-gray-200"
      style={{
        left: x,
        top: y,
        minWidth: '160px'
      }}
    >
      <button
        onClick={onEdit}
        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <PencilIcon className="h-4 w-4 mr-2" />
        Düzenle
      </button>
      <button
        onClick={onDelete}
        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
      >
        <TrashIcon className="h-4 w-4 mr-2" />
        Sil
      </button>
    </div>
  )
} 