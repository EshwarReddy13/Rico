import React from 'react'
import { BoldButton } from './BoldButton'
import { ItalicButton } from './ItalicButton'
import { UnderlineButton } from './UnderlineButton'
import { StrikethroughButton } from './StrikethroughButton'
import { AlignmentButtons } from './AlignmentButtons'
import { FontSizeSelector } from './FontSizeSelector'
import { FontFamilySelector } from './FontFamilySelector'
import { TextColorPicker } from './TextColorPicker'
import { BackgroundColorPicker } from './BackgroundColorPicker'

interface FormatButtonsProps {
  theme?: 'light' | 'dark'
  editor?: any
}

export function FormatButtons({ theme = 'light', editor }: FormatButtonsProps) {
  return (
    <div className="format-buttons flex gap-2">
      {/* Font and size selectors */}
      <div className="flex gap-1">
        <FontFamilySelector theme={theme} editor={editor} />
        <FontSizeSelector theme={theme} editor={editor} />
      </div>

      {/* Divider */}
      <div 
        className="w-px h-8 self-center"
        style={{ backgroundColor: theme === 'dark' ? '#4b5563' : '#dadce0' }}
      />

      {/* Basic formatting */}
      <div className="flex gap-1">
        <BoldButton theme={theme} editor={editor} />
        <ItalicButton theme={theme} editor={editor} />
        <UnderlineButton theme={theme} editor={editor} />
        <StrikethroughButton theme={theme} editor={editor} />
      </div>

      {/* Divider */}
      <div 
        className="w-px h-8 self-center"
        style={{ backgroundColor: theme === 'dark' ? '#4b5563' : '#dadce0' }}
      />

      {/* Colors */}
      <div className="flex gap-1">
        <TextColorPicker theme={theme} editor={editor} />
        <BackgroundColorPicker theme={theme} editor={editor} />
      </div>

      {/* Divider */}
      <div 
        className="w-px h-8 self-center"
        style={{ backgroundColor: theme === 'dark' ? '#4b5563' : '#dadce0' }}
      />

      {/* Alignment */}
      <AlignmentButtons theme={theme} editor={editor} />
    </div>
  )
} 