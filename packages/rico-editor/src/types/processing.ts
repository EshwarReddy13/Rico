export type SupportedFileType = 'docx' | 'pdf' | 'txt' | 'md'

export interface FileMetadata {
  name: string
  size: number
  type: string
  lastModified: Date
}

export interface ProcessingResult {
  content: string
  metadata: FileMetadata
  processingTime: number
} 