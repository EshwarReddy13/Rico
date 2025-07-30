import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { LinearEditorProps } from './types'
import { TipTapEditor, TipTapEditorRef } from './TipTapEditor'

export interface LinearEditorRef {
  editor: any
}

export const LinearEditor = forwardRef<LinearEditorRef, LinearEditorProps>(({ 
  content, 
  onChange, 
  theme = 'light' 
}, ref) => {
  const [isClient, setIsClient] = useState(false)
  const tipTapRef = React.useRef<TipTapEditorRef>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useImperativeHandle(ref, () => ({
    get editor() {
      return tipTapRef.current?.editor
    }
  }), [])

  if (!isClient) {
    return (
      <div className="linear-editor w-full h-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="linear-editor w-full h-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <TipTapEditor 
        ref={tipTapRef}
        content={content}
        onChange={onChange}
        theme={theme}
        placeholder="Start writing your document..."
      />
    </div>
  )
}) 