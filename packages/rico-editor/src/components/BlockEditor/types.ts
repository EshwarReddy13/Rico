export interface BlockEditorProps {
  blocks?: Block[]
  onChange?: (blocks: Block[]) => void
}

export interface Block {
  id: string
  type: 'text' | 'heading' | 'list' | 'image'
  content: any
} 