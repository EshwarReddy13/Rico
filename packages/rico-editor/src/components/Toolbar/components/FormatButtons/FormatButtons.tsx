import React from 'react'
import { BoldButton } from './BoldButton'
import { ItalicButton } from './ItalicButton'

interface FormatButtonsProps {
  theme?: 'light' | 'dark'
  editor?: any
}

export function FormatButtons({ theme = 'light', editor }: FormatButtonsProps) {
  return (
    <div className="format-buttons flex gap-1">
      <BoldButton theme={theme} editor={editor} />
      <ItalicButton theme={theme} editor={editor} />
    </div>
  )
} 