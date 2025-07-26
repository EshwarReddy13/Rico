import { useState } from 'react'
import { FileProcessor } from '../services/processing'

export function useFileProcessing() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processFile = async (file: File) => {
    setIsProcessing(true)
    setError(null)

    try {
      const processor = new FileProcessor()
      const result = await processor.processFile(file)
      console.log('File processed:', result)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    } finally {
      setIsProcessing(false)
    }
  }

  return { processFile, isProcessing, error }
} 