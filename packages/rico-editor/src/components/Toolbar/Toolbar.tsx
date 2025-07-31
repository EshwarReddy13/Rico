import React from 'react'
import { ToolbarProps } from './types'
import { FormatButtons } from './components/FormatButtons'
import { ModeToggle } from './components/ModeToggle'
import { SaveIndicator } from './components/SaveIndicator'
import { SaveButton } from './components/SaveButton'
import { CloseButton } from './components/CloseButton'
import { EditableTitle } from './components/EditableTitle'


export function Toolbar({ 
  mode, 
  onModeChange, 
  theme, 
  onSave, 
  onClose,
  lastSaved, 
  isDirty,
  editor,
  title,
  onTitleChange
}: ToolbarProps) {
  return (
    <div
      className="rico-toolbar border-b-2 pl-10 pr-10 pt-2 pb-2 flex items-center justify-between bg-white border-black"
    >
      {/* Left section - Format buttons */}
      <div className="flex items-center gap-2 flex-1">
        <FormatButtons theme={theme} editor={editor} />
      </div>

      {/* Middle section - Editable title */}
      <div className="flex items-center justify-center flex-1">
        <EditableTitle
          title={title}
          onTitleChange={onTitleChange}
          theme={theme}
        />
      </div>

      {/* Right section - Controls */}
      <div className="flex items-center gap-2 flex-1 justify-end">
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

        {onClose && (
          <CloseButton
            onClose={onClose}
            theme={theme}
          />
        )}
      </div>
    </div>
  )
} 