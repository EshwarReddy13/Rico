import { DocumentService } from '../services/firebase'

/**
 * Generate a unique document ID with collision checking
 * This function should be used when creating new documents
 */
export async function generateUniqueDocumentId(documentService: DocumentService): Promise<string> {
  return await documentService.generateUniqueDocumentId()
} 