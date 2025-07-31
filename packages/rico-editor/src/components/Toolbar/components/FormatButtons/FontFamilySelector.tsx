import React, { useState, useRef, useEffect } from 'react'

interface FontFamilySelectorProps {
  theme?: 'light' | 'dark'
  editor?: any
}

export function FontFamilySelector({ theme = 'light', editor }: FontFamilySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fontFamilies = [
    { value: 'Inter, system-ui, sans-serif', label: 'Inter', category: 'Sans Serif' },
    { value: 'Arial, sans-serif', label: 'Arial', category: 'Sans Serif' },
    { value: 'Helvetica, sans-serif', label: 'Helvetica', category: 'Sans Serif' },
    { value: 'Georgia, serif', label: 'Georgia', category: 'Serif' },
    { value: 'Times New Roman, serif', label: 'Times', category: 'Serif' },
    { value: 'Courier New, monospace', label: 'Courier', category: 'Monospace' },
    { value: 'Monaco, monospace', label: 'Monaco', category: 'Monospace' },
    { value: 'Comic Sans MS, cursive', label: 'Comic Sans', category: 'Cursive' },
  ]

  const getCurrentFontFamily = () => {
    if (!editor) return 'Inter, system-ui, sans-serif'
    const currentStyle = editor.getAttributes('textStyle')
    return currentStyle.fontFamily || 'Inter, system-ui, sans-serif'
  }

  const handleFontFamilyChange = (fontFamily: string) => {
    if (editor) {
      editor.chain().focus().setFontFamily(fontFamily).run()
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

  const currentFontFamily = getCurrentFontFamily()
  const displayLabel = fontFamilies.find(font => font.value === currentFontFamily)?.label || 'Inter'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="format-button px-3 py-2 rounded transition hover:opacity-80 min-w-20 text-sm"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: theme === 'dark' ? '#4b5563' : '#f1f3f4',
          color: theme === 'dark' ? '#f9fafb' : '#5f6368',
          border: `1px solid ${theme === 'dark' ? '#6b7280' : '#dadce0'}`
        }}
        title="Font Family"
      >
        {displayLabel}
        <span className="ml-1">▼</span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 rounded shadow-lg border z-50 max-h-64 overflow-y-auto min-w-40"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            borderColor: theme === 'dark' ? '#4b5563' : '#dadce0'
          }}
        >
          {fontFamilies.map((font) => (
            <button
              key={font.value}
              className="block w-full text-left px-3 py-2 hover:opacity-80 transition text-sm"
              style={{
                backgroundColor: currentFontFamily === font.value 
                  ? (theme === 'dark' ? '#4b5563' : '#f1f3f4')
                  : 'transparent',
                color: theme === 'dark' ? '#f9fafb' : '#5f6368',
                fontFamily: font.value
              }}
              onClick={() => handleFontFamilyChange(font.value)}
            >
              <div>
                <div className="font-medium">{font.label}</div>
                <div className="text-xs opacity-60">{font.category}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}