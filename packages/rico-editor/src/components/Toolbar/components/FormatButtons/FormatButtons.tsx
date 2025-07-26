import React from 'react'
import { BoldButton } from './BoldButton'
import { ItalicButton } from './ItalicButton'

interface FormatButtonsProps {
  theme?: 'light' | 'dark'
}

export function FormatButtons({ theme = 'light' }: FormatButtonsProps) {
  return (
    <div className="format-buttons flex gap-1">
      <BoldButton theme={theme} />
      <ItalicButton theme={theme} />
    </div>
  )
} 