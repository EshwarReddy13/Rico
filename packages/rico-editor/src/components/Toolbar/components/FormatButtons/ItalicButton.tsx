import React from 'react'

interface ItalicButtonProps {
  theme?: 'light' | 'dark'
}

export function ItalicButton({ theme = 'light' }: ItalicButtonProps) {
  return (
    <button 
      className="format-button p-2 rounded transition hover:opacity-80" 
      type="button"
      style={{
        backgroundColor: theme === 'dark' ? '#4b5563' : '#f1f3f4',
        color: theme === 'dark' ? '#f9fafb' : '#5f6368'
      }}
    >
      <em>I</em>
    </button>
  )
} 