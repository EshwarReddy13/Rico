import React, { useState, useRef, useEffect } from 'react'

interface BackgroundColorPickerProps {
  theme?: 'light' | 'dark'
  editor?: any
}

export function BackgroundColorPicker({ theme = 'light', editor }: BackgroundColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const colors = [
    { value: '#fef3c7', label: 'Light Yellow' },
    { value: '#fed7c2', label: 'Light Orange' },
    { value: '#fecaca', label: 'Light Red' },
    { value: '#fce7f3', label: 'Light Pink' },
    { value: '#e0e7ff', label: 'Light Blue' },
    { value: '#ddd6fe', label: 'Light Purple' },
    { value: '#d1fae5', label: 'Light Green' },
    { value: '#d0f2ff', label: 'Light Cyan' },
    { value: '#f59e0b', label: 'Yellow' },
    { value: '#f97316', label: 'Orange' },
    { value: '#ef4444', label: 'Red' },
    { value: '#ec4899', label: 'Pink' },
    { value: '#3b82f6', label: 'Blue' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#10b981', label: 'Green' },
    { value: '#06b6d4', label: 'Cyan' },
  ]

  const getCurrentHighlight = () => {
    if (!editor) return null
    return editor.isActive('highlight') ? 
      editor.getAttributes('highlight').color : null
  }

  const handleColorChange = (color: string) => {
    if (editor) {
      editor.chain().focus().setHighlight({ color }).run()
    }
    setIsOpen(false)
  }

  const handleRemoveHighlight = () => {
    if (editor) {
      editor.chain().focus().unsetHighlight().run()
    }
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const currentHighlight = getCurrentHighlight()
  const isActive = editor?.isActive('highlight') || false

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`format-button p-2 rounded transition hover:opacity-80 relative ${
          isActive ? 'ring-2 ring-blue-500' : ''
        }`}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: isActive 
            ? (theme === 'dark' ? '#3b82f6' : '#3b82f6')
            : (theme === 'dark' ? '#4b5563' : '#f1f3f4'),
          color: isActive 
            ? '#ffffff'
            : (theme === 'dark' ? '#f9fafb' : '#5f6368'),
          border: `1px solid ${theme === 'dark' ? '#6b7280' : '#dadce0'}`
        }}
        title="Background Color"
      >
        <span>H</span>
        <div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-1 rounded"
          style={{ backgroundColor: currentHighlight || '#f59e0b' }}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 rounded shadow-lg border z-50 p-3"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            borderColor: theme === 'dark' ? '#4b5563' : '#dadce0'
          }}
        >
          <div className="grid grid-cols-4 gap-2 mb-3">
            {colors.map((color) => (
              <button
                key={color.value}
                className="w-8 h-8 rounded border-2 transition hover:scale-110"
                style={{ 
                  backgroundColor: color.value,
                  borderColor: currentHighlight === color.value ? '#3b82f6' : '#d1d5db'
                }}
                onClick={() => handleColorChange(color.value)}
                title={color.label}
              />
            ))}
          </div>
          
          <button
            className="w-full px-3 py-2 text-sm rounded transition hover:opacity-80"
            style={{
              backgroundColor: theme === 'dark' ? '#4b5563' : '#f1f3f4',
              color: theme === 'dark' ? '#f9fafb' : '#5f6368'
            }}
            onClick={handleRemoveHighlight}
          >
            Remove Highlight
          </button>
        </div>
      )}
    </div>
  )
}