export type EditorMode = 'linear' | 'block'
export type EditorTheme = 'light' | 'dark'

export interface EditorState {
  mode: EditorMode
  content: any
  isDirty: boolean
  lastSaved: Date | null
} 