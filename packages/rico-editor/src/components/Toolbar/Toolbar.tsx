import React from 'react'
import { ToolbarProps } from './types'
import { FormatButtons } from './components/FormatButtons'
import { ModeToggle } from './components/ModeToggle'
import { SaveIndicator } from './components/SaveIndicator'
import { SaveButton } from './components/SaveButton'

export function Toolbar({ mode, onModeChange, theme, onSave, lastSaved, isDirty }: ToolbarProps) {
  return (
    <div
      className="rico-toolbar border-b p-2 flex items-center justify-between"
      style={{
        backgroundColor: theme === 'dark' ? '#374151' : '#f8f9fa',
        borderColor: theme === 'dark' ? '#4b5563' : '#dadce0'
      }}
    >
      <div className="flex items-center gap-2">
        <FormatButtons theme={theme} />
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle
          mode={mode}
          onModeChange={onModeChange}
          theme={theme}
        />
        <SaveButton
          onSave={onSave}
          theme={theme}
          isDirty={isDirty}
        />
        <SaveIndicator theme={theme} />
      </div>
    </div>
  )
} 