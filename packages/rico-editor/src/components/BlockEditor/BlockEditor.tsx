import React from 'react'
import { BlockEditorProps } from './types'
import { TextBlock } from './components/TextBlock'

export function BlockEditor(props: BlockEditorProps) {
  return (
    <div className="block-editor">
      <TextBlock />
    </div>
  )
} 