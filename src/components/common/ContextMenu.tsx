import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface ContextMenuItem {
  label: string
  onClick: () => void
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
  items: ContextMenuItem[]
}

export default function ContextMenu({ x, y, onClose, items }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

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
      className="fixed bg-white dark:bg-gray-800 shadow-lg rounded-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
      style={{
        left: x,
        top: y,
        minWidth: '160px'
      }}
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            item.onClick()
            onClose()
          }}
          className={`w-full flex items-center px-4 py-2 text-sm ${
            item.className || 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {item.icon && <item.icon className="h-4 w-4 mr-2" />}
          {t(item.label)}
        </button>
      ))}
    </div>
  )
} 