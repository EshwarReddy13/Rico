import { useEffect } from 'react'

export function useAutoSave(content: any, onSave: (content: any) => void, delay = 2000) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content) {
        console.log('Auto-saving content...')
        onSave(content)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [content, onSave, delay])
} 