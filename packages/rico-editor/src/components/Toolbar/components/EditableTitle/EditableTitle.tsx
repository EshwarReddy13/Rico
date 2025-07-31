import React, { useState, useRef, useEffect } from 'react'

interface EditableTitleProps {
  title?: string
  onTitleChange?: (title: string) => void
  theme?: 'light' | 'dark'
}

export function EditableTitle({ 
  title = 'Untitled Document', 
  onTitleChange, 
  theme = 'light' 
}: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localTitle, setLocalTitle] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  // Update local title when prop changes
  useEffect(() => {
    setLocalTitle(title)
  }, [title])

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (localTitle.trim() !== title) {
      onTitleChange?.(localTitle.trim() || 'Untitled Document')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleBlur()
    } else if (e.key === 'Escape') {
      setLocalTitle(title)
      setIsEditing(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value)
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={localTitle}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="text-center text-lg font-medium bg-transparent border border-gray-400 rounded px-3 py-2 outline-none min-w-48 max-w-96"
        style={{
          color: theme === 'dark' ? '#f9fafb' : '#1f2937'
        }}
        placeholder="Document title..."
      />
    )
  }

  return (
    <button
      onClick={handleClick}
      className="text-center text-lg font-medium px-3 py-2 rounded transition-all duration-200 hover:border hover:border-gray-400 min-w-48 max-w-96 truncate"
      style={{
        color: theme === 'dark' ? '#f9fafb' : '#1f2937'
      }}
      title="Click to edit document title"
    >
      {localTitle}
    </button>
  )
}