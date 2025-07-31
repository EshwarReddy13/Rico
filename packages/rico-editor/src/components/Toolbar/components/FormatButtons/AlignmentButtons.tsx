import React from 'react'

interface AlignmentButtonsProps {
  theme?: 'light' | 'dark'
  editor?: any
}

export function AlignmentButtons({ theme = 'light', editor }: AlignmentButtonsProps) {
  const alignments = [
    { name: 'left', label: 'Left', icon: '⫷' },
    { name: 'center', label: 'Center', icon: '≡' },
    { name: 'right', label: 'Right', icon: '⫸' },
  ]

  const handleAlignment = (alignment: string) => {
    if (editor) {
      editor.chain().focus().setTextAlign(alignment).run()
    }
  }

  return (
    <div className="flex gap-1">
      {alignments.map((alignment) => {
        const isActive = editor?.isActive({ textAlign: alignment.name }) || false
        
        return (
          <button
            key={alignment.name}
            className={`format-button p-2 rounded transition hover:opacity-80 ${
              isActive ? 'ring-2 ring-blue-500' : ''
            }`}
            type="button"
            onClick={() => handleAlignment(alignment.name)}
            style={{
              backgroundColor: isActive 
                ? (theme === 'dark' ? '#3b82f6' : '#3b82f6')
                : (theme === 'dark' ? '#4b5563' : '#f1f3f4'),
              color: isActive 
                ? '#ffffff'
                : (theme === 'dark' ? '#f9fafb' : '#5f6368')
            }}
            title={`Align ${alignment.label}`}
          >
            {alignment.icon}
          </button>
        )
      })}
    </div>
  )
}