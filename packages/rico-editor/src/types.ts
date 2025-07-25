export interface RicoEditorProps {
  user: string;        // User identifier (email, ID, etc.)
  file: string;        // Document identifier
  apiKey?: string;     // Optional Firebase config override
  theme?: 'light' | 'dark';
  className?: string;  // Optional custom styling
}

export interface EditorState {
  isLoading: boolean;
  currentView: 'linear' | 'block';
  documentTitle: string;
  content: any; // Will be Quill Delta or block structure
  lastSaved: Date | null;
}

export interface DocumentMetadata {
  id: string;
  title: string;
  owner: string;
  collaborators: string[];
  createdAt: Date;
  updatedAt: Date;
} 