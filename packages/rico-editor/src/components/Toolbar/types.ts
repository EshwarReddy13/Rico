export interface ToolbarProps {
  mode?: 'linear' | 'block'
  onModeChange?: (mode: 'linear' | 'block') => void
  theme?: 'light' | 'dark'
  lastSaved?: Date | null
  isDirty?: boolean
  onSave?: () => void
  onClose?: () => Promise<void>
  editor?: any
  title?: string
  onTitleChange?: (title: string) => void
} 