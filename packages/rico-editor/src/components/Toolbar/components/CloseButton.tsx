import React from 'react'

interface CloseButtonProps {
  onClose: () => Promise<void>
  theme?: 'light' | 'dark'
}

export function CloseButton({ onClose, theme = 'light' }: CloseButtonProps) {
  const handleClick = async () => {
    try {
      console.log('💾 Save button clicked - saving document...')
      await onClose()
      console.log('✅ Document saved successfully!')
    } catch (error) {
      console.error('❌ Failed to save document:', error)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="px-3 py-1 rounded text-sm font-medium transition-colors"
      style={{
        backgroundColor: theme === 'dark' ? '#10b981' : '#059669',
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = theme === 'dark' ? '#34d399' : '#10b981'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = theme === 'dark' ? '#10b981' : '#059669'
      }}
      title="Save document"
    >
      Save
    </button>
  )
} 