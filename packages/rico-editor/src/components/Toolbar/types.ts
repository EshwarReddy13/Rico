export interface ToolbarProps {
  mode?: 'linear' | 'block'
  onModeChange?: (mode: 'linear' | 'block') => void
  theme?: 'light' | 'dark'
  lastSaved?: Date | null
  isDirty?: boolean
  onSave?: () => void
} 