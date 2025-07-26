import React from 'react'

interface SaveButtonProps {
  onSave?: () => void
  theme?: 'light' | 'dark'
  isDirty?: boolean
}

export function SaveButton({ onSave, theme = 'light', isDirty = false }: SaveButtonProps) {
  return (
    <button
      onClick={onSave}
      className="save-button px-3 py-1 text-sm rounded transition hover:opacity-80 flex items-center gap-1"
      type="button"
      style={{
        backgroundColor: theme === 'dark' ? '#4b5563' : '#f1f3f4',
        color: theme === 'dark' ? '#f9fafb' : '#5f6368'
      }}
    >
      <span>💾</span>
      <span>{isDirty ? 'Save*' : 'Save'}</span>
    </button>
  )
} 