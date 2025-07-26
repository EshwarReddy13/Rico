import React, { useState, useRef, useEffect } from 'react'

export function TextBlock() {
  const [isEmpty, setIsEmpty] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      setIsEmpty(contentRef.current.textContent === '')
    }
  }, [])

  const handleInput = () => {
    if (contentRef.current) {
      setIsEmpty(contentRef.current.textContent === '')
    }
  }

  return (
    <div className="text-block">
      <div 
        ref={contentRef}
        contentEditable 
        suppressContentEditableWarning={true}
        style={{ 
          padding: '8px', 
          border: '1px solid #ddd',
          minHeight: '20px',
          outline: 'none',
          position: 'relative'
        }}
        onInput={handleInput}
        onFocus={() => {
          if (contentRef.current) {
            contentRef.current.style.borderColor = '#007bff'
          }
        }}
        onBlur={() => {
          if (contentRef.current) {
            contentRef.current.style.borderColor = '#ddd'
          }
        }}
      />
      {isEmpty && (
        <div 
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            color: '#999',
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          Click to edit text...
        </div>
      )}
    </div>
  )
} 