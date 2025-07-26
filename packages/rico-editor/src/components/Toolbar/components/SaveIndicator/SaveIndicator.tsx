import React from 'react'

interface SaveIndicatorProps {
  theme?: 'light' | 'dark'
}

export function SaveIndicator({ theme = 'light' }: SaveIndicatorProps) {
  return (
    <div 
      className="save-indicator flex items-center gap-1 px-2 py-1 text-xs"
      style={{
        color: theme === 'dark' ? '#9ca3af' : '#5f6368'
      }}
    >
      <div 
        className="w-1.5 h-1.5 bg-green-500 rounded-full"
        title="Auto-saved"
      />
      <span>Saved</span>
    </div>
  )
} 