import React, { useEffect, useImperativeHandle, forwardRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import CodeBlock from '@tiptap/extension-code-block'
import Blockquote from '@tiptap/extension-blockquote'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import './TipTapEditor.css'

interface TipTapEditorProps {
  content?: any
  onChange?: (content: any) => void
  theme?: 'light' | 'dark'
  placeholder?: string
  className?: string
}

export interface TipTapEditorRef {
  editor: any
}

export const TipTapEditor = forwardRef<TipTapEditorRef, TipTapEditorProps>(({ 
  content, 
  onChange, 
  theme = 'light',
  placeholder = 'Start writing...',
  className = ''
}, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6]
        }
      }),
      Placeholder.configure({
        placeholder,
      }),
      Highlight,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify']
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      CodeBlock,
      Blockquote,
      HorizontalRule,
      TaskList,
      TaskItem.configure({
        nested: true,
      })
    ],
    content: content || {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Start writing your document...' }],
        },
      ],
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      onChange?.(json)
    },
    onCreate: ({ editor }) => {
      console.log('Editor created')
    },
    immediatelyRender: false,
  })

  // Expose editor instance via ref
  useImperativeHandle(ref, () => ({
    editor
  }), [editor])

  // Update content when prop changes
  useEffect(() => {
    if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-full bg-white dark:bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    )
  }

  return (
    <div className={`tiptap-editor ${className}`}>
      <EditorContent 
        editor={editor} 
        className="w-full h-full outline-none"
      />
    </div>
  )
})