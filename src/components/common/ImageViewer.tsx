import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface ImageViewerProps {
  imageUrl: string
  alt: string
  onClose: () => void
}

export default function ImageViewer({ imageUrl, alt, onClose }: ImageViewerProps) {
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const newScale = scale + (e.deltaY > 0 ? -0.1 : 0.1)
    setScale(Math.min(Math.max(0.5, newScale), 3))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale === 1) return
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation()
    setScale(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation()
    setScale(prev => Math.max(prev - 0.2, 0.5))
  }

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation()
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 select-none"
      onClick={handleBackdropClick}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute top-4 right-4 flex space-x-2 z-50">
        <button 
          onClick={handleZoomOut}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <MinusIcon className="h-6 w-6 text-white" />
        </button>
        <button 
          onClick={handleZoomIn}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <PlusIcon className="h-6 w-6 text-white" />
        </button>
        <button 
          onClick={handleReset}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-colors"
        >
          Reset
        </button>
        <button 
          onClick={handleClose}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <XMarkIcon className="h-6 w-6 text-white" />
        </button>
      </div>

      <div 
        className="absolute inset-0 flex items-center justify-center"
        onWheel={handleWheel}
      >
        <div
          className="relative cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onClick={(e) => e.stopPropagation()}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s'
          }}
        >
          <img 
            src={imageUrl} 
            alt={alt}
            className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
            draggable={false}
          />
        </div>
      </div>
    </div>
  )
} 