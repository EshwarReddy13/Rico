export interface RicoEditorProps {
  user: string
  file: string
  initialContent?: any
  mode?: 'linear' | 'block'
  theme?: 'light' | 'dark'
  className?: string
  onSave?: (content: any) => void
  onModeChange?: (mode: 'linear' | 'block') => void
  onClose?: () => void
}

export interface RicoEditorState {
  isLoading: boolean
  mode: 'linear' | 'block'
  content: any
  documentTitle: string
  lastSaved: Date | null
  isDirty: boolean
} 