import React from 'react'
import { LinearEditorProps } from './types'
import { QuillWrapper } from './QuillWrapper'

export function LinearEditor(props: LinearEditorProps) {
  return (
    <div className="linear-editor">
      <QuillWrapper />
    </div>
  )
} 