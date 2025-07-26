export interface ProcessedFile {
  content: string
  type: 'docx' | 'pdf' | 'txt'
  metadata?: {
    title?: string
    author?: string
    createdAt?: Date
  }
} 