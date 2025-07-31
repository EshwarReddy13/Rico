import React from 'react'

interface StrikethroughButtonProps {
  theme?: 'light' | 'dark'
  editor?: any
}

export function StrikethroughButton({ theme = 'light', editor }: StrikethroughButtonProps) {
  const handleClick = () => {
    if (editor) {
      editor.chain().focus().toggleStrike().run()
    }
  }

  const isActive = editor?.isActive('strike') || false

  return (
    <button 
      className={`format-button p-2 rounded transition hover:opacity-80 ${
        isActive ? 'ring-2 ring-blue-500' : ''
      }`}
      type="button"
      onClick={handleClick}
      style={{
        backgroundColor: isActive 
          ? (theme === 'dark' ? '#3b82f6' : '#3b82f6')
          : (theme === 'dark' ? '#4b5563' : '#f1f3f4'),
        color: isActive 
          ? '#ffffff'
          : (theme === 'dark' ? '#f9fafb' : '#5f6368')
      }}
      title="Strikethrough"
    >
      <span style={{ textDecoration: 'line-through' }}>S</span>
    </button>
  )
}