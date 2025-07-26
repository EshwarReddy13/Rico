import React from 'react'

interface ModeToggleProps {
  mode?: 'linear' | 'block'
  onModeChange?: (mode: 'linear' | 'block') => void
  theme?: 'light' | 'dark'
}

export function ModeToggle({ mode = 'linear', onModeChange, theme = 'light' }: ModeToggleProps) {
  return (
    <div className="mode-toggle flex rounded-md overflow-hidden">
      <button 
        type="button"
        onClick={() => onModeChange?.('linear')}
        className={`px-3 py-1 text-sm transition ${
          mode === 'linear' ? 'opacity-100' : 'opacity-60 hover:opacity-80'
        }`}
        style={{
          backgroundColor: mode === 'linear' 
            ? (theme === 'dark' ? '#4f46e5' : '#1a73e8')
            : (theme === 'dark' ? '#4b5563' : '#f1f3f4'),
          color: mode === 'linear'
            ? '#ffffff'
            : (theme === 'dark' ? '#f9fafb' : '#5f6368')
        }}
      >
        📝 Linear
      </button>
      <button 
        type="button"
        onClick={() => onModeChange?.('block')}
        className={`px-3 py-1 text-sm transition ${
          mode === 'block' ? 'opacity-100' : 'opacity-60 hover:opacity-80'
        }`}
        style={{
          backgroundColor: mode === 'block' 
            ? (theme === 'dark' ? '#4f46e5' : '#1a73e8')
            : (theme === 'dark' ? '#4b5563' : '#f1f3f4'),
          color: mode === 'block'
            ? '#ffffff'
            : (theme === 'dark' ? '#f9fafb' : '#5f6368')
        }}
      >
        🧱 Block
      </button>
    </div>
  )
} 