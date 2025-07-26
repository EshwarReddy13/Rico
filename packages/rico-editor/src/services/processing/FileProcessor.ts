import { ProcessedFile } from './types'

export class FileProcessor {
  async processFile(file: File): Promise<ProcessedFile> {
    console.log('Processing file:', file.name)
    
    const extension = file.name.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'docx':
        return this.processDocx(file)
      case 'pdf':
        return this.processPdf(file)
      case 'txt':
        return this.processTxt(file)
      default:
        throw new Error(`Unsupported file type: ${extension}`)
    }
  }

  private async processDocx(file: File): Promise<ProcessedFile> {
    // DOCX processing logic will go here
    return { content: 'DOCX content', type: 'docx' }
  }

  private async processPdf(file: File): Promise<ProcessedFile> {
    // PDF processing logic will go here
    return { content: 'PDF content', type: 'pdf' }
  }

  private async processTxt(file: File): Promise<ProcessedFile> {
    const text = await file.text()
    return { content: text, type: 'txt' }
  }
} 