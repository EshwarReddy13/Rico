import React, { useState, useRef, useEffect } from 'react'

interface FontSizeSelectorProps {
  theme?: 'light' | 'dark'
  editor?: any
}

export function FontSizeSelector({ theme = 'light', editor }: FontSizeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fontSizes = [
    { value: '12px', label: '12' },
    { value: '14px', label: '14' },
    { value: '16px', label: '16' },
    { value: '18px', label: '18' },
    { value: '20px', label: '20' },
    { value: '24px', label: '24' },
    { value: '28px', label: '28' },
    { value: '32px', label: '32' },
    { value: '36px', label: '36' },
    { value: '48px', label: '48' },
    { value: '60px', label: '60' },
    { value: '72px', label: '72' },
  ]

  const getCurrentFontSize = () => {
    if (!editor) return '16px'
    // Try to get current font size from editor
    const currentStyle = editor.getAttributes('textStyle')
    return currentStyle.fontSize || '16px'
  }

  const handleFontSizeChange = (fontSize: string) => {
    if (editor) {
      // Font size doesn't have an official TipTap extension, so we use setMark with textStyle
      editor.chain().focus().setMark('textStyle', { fontSize }).run()
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

  const currentFontSize = getCurrentFontSize()
  const displayLabel = fontSizes.find(size => size.value === currentFontSize)?.label || '16'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="format-button px-3 py-2 rounded transition hover:opacity-80 min-w-12 text-sm"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: theme === 'dark' ? '#4b5563' : '#f1f3f4',
          color: theme === 'dark' ? '#f9fafb' : '#5f6368',
          border: `1px solid ${theme === 'dark' ? '#6b7280' : '#dadce0'}`
        }}
        title="Font Size"
      >
        {displayLabel}
        <span className="ml-1">▼</span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 rounded shadow-lg border z-50 max-h-48 overflow-y-auto"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            borderColor: theme === 'dark' ? '#4b5563' : '#dadce0'
          }}
        >
          {fontSizes.map((fontSize) => (
            <button
              key={fontSize.value}
              className="block w-full text-left px-3 py-2 hover:opacity-80 transition text-sm"
              style={{
                backgroundColor: currentFontSize === fontSize.value 
                  ? (theme === 'dark' ? '#4b5563' : '#f1f3f4')
                  : 'transparent',
                color: theme === 'dark' ? '#f9fafb' : '#5f6368'
              }}
              onClick={() => handleFontSizeChange(fontSize.value)}
            >
              {fontSize.label}px
            </button>
          ))}
        </div>
      )}
    </div>
  )
}