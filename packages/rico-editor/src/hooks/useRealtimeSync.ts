import { useEffect, useState } from 'react'
import { RealtimeManager } from '../services/realtime'

export function useRealtimeSync(documentId: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [content, setContent] = useState<any>(null)

  useEffect(() => {
    const realtimeManager = new RealtimeManager(documentId)
    
    realtimeManager.connect()
    setIsConnected(true)

    realtimeManager.onContentChange((newContent) => {
      setContent(newContent)
    })

    return () => {
      realtimeManager.disconnect()
      setIsConnected(false)
    }
  }, [documentId])

  return { isConnected, content, setContent }
} 