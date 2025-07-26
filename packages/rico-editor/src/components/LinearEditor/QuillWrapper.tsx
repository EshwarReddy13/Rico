import React, { useEffect, useRef } from 'react'

export function QuillWrapper() {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Quill initialization will go here
    console.log('Quill wrapper mounted')
  }, [])

  return (
    <div 
      ref={editorRef} 
      className="quill-wrapper"
      style={{ minHeight: '300px', border: '1px solid #ccc' }}
    />
  )
} 