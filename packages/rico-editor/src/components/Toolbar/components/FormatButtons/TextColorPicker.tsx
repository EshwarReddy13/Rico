import React, { useState, useRef, useEffect } from 'react'

interface TextColorPickerProps {
  theme?: 'light' | 'dark'
  editor?: any
}

export function TextColorPicker({ theme = 'light', editor }: TextColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const colors = [
    { value: '#000000', label: 'Black' },
    { value: '#374151', label: 'Dark Gray' },
    { value: '#6b7280', label: 'Gray' },
    { value: '#9ca3af', label: 'Light Gray' },
    { value: '#ef4444', label: 'Red' },
    { value: '#f97316', label: 'Orange' },
    { value: '#f59e0b', label: 'Yellow' },
    { value: '#10b981', label: 'Green' },
    { value: '#3b82f6', label: 'Blue' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#ec4899', label: 'Pink' },
    { value: '#06b6d4', label: 'Cyan' },
  ]

  const getCurrentTextColor = () => {
    if (!editor) return '#000000'
    const currentStyle = editor.getAttributes('textStyle')
    return currentStyle.color || '#000000'
  }

  const handleColorChange = (color: string) => {
    if (editor) {
      editor.chain().focus().setColor(color).run()
    }
    setIsOpen(false)
  }

  const handleRemoveColor = () => {
    if (editor) {
      editor.chain().focus().unsetColor().run()
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

  const currentColor = getCurrentTextColor()

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="format-button p-2 rounded transition hover:opacity-80 relative"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: theme === 'dark' ? '#4b5563' : '#f1f3f4',
          color: theme === 'dark' ? '#f9fafb' : '#5f6368',
          border: `1px solid ${theme === 'dark' ? '#6b7280' : '#dadce0'}`
        }}
        title="Text Color"
      >
        <span style={{ color: currentColor }}>A</span>
        <div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-1 rounded"
          style={{ backgroundColor: currentColor }}
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
                  borderColor: currentColor === color.value ? '#3b82f6' : 'transparent'
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
            onClick={handleRemoveColor}
          >
            Remove Color
          </button>
        </div>
      )}
    </div>
  )
}