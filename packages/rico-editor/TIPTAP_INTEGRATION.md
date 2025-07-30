# TipTap Integration for Rico Editor

## Overview

The Rico Editor now uses TipTap as a **headless rich text engine**, providing powerful content management capabilities while keeping the existing UI components and Tailwind CSS styling. This approach gives us the best of both worlds: TipTap's robust content handling with our existing design system.

## Architecture

### Headless TipTap Engine
- **Content Management**: TipTap handles all content operations, JSON structure, and state management
- **Extensions**: Rich set of formatting extensions (bold, italic, headings, lists, etc.)
- **No UI Dependencies**: We don't use any of TipTap's UI components
- **Existing UI**: Uses the existing toolbar and components with Tailwind CSS

### Integration Points
- **TipTapEditor**: Headless engine that manages content and exposes editor instance
- **LinearEditor**: Wrapper that provides the editor instance to parent components
- **RicoEditor**: Passes editor instance to the existing toolbar
- **Toolbar**: Existing toolbar with enhanced format buttons that use TipTap commands

## Features

### Core Functionality
- **Rich Text Editing**: Full support for bold, italic, underline, headings, lists, and more
- **Dark/Light Theme Support**: Seamless theme switching with proper styling
- **Auto-save**: Automatic content saving with configurable intervals
- **Real-time Collaboration**: Ready for collaborative editing features
- **Accessible**: Full keyboard navigation and screen reader support
- **Existing Design**: Maintains current UI/UX design with Tailwind CSS

### Available Extensions
- **StarterKit**: Basic formatting (bold, italic, headings, lists, etc.)
- **Placeholder**: Shows placeholder text when editor is empty
- **Highlight**: Text highlighting functionality
- **Underline**: Underline text formatting
- **TextAlign**: Text alignment (left, center, right, justify)
- **Link**: Link insertion and management
- **Image**: Image insertion support
- **CodeBlock**: Code block with syntax highlighting
- **Blockquote**: Quote formatting
- **HorizontalRule**: Horizontal divider lines
- **TaskList & TaskItem**: Checkbox/todo list functionality

## Usage

### Basic Implementation

```tsx
import { RicoEditor } from '@rico/editor'

function MyComponent() {
  const handleSave = (content) => {
    console.log('Content saved:', content)
  }

  return (
    <RicoEditor
      user="user@example.com"
      file="document-id"
      theme="light" // or "dark"
      onSave={handleSave}
    />
  )
}
```

### Component Structure

```tsx
// The editor uses this internal structure:
<RicoEditor>
  <Toolbar editor={editor} />
  <LinearEditor>
    <TipTapEditor /> // Headless engine
  </LinearEditor>
</RicoEditor>
```

## Content Format

TipTap uses a JSON-based content format that's compatible with ProseMirror. The content structure looks like:

```json
{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Hello, world!"
        }
      ]
    }
  ]
}
```

## Customization

### Adding New Extensions

To add new TipTap extensions, modify the `TipTapEditor.tsx` file:

```tsx
import NewExtension from '@tiptap/extension-new-extension'

// Add to extensions array
extensions: [
  StarterKit,
  NewExtension.configure({
    // configuration options
  }),
  // ... other extensions
]
```

### Adding New Format Buttons

To add new format buttons to the existing toolbar:

1. Create a new button component in `FormatButtons/`
2. Add TipTap commands to the button
3. Update `FormatButtons.tsx` to include the new button

Example:
```tsx
// NewButton.tsx
export function NewButton({ theme = 'light', editor }: NewButtonProps) {
  const handleClick = () => {
    if (editor) {
      editor.chain().focus().newCommand().run()
    }
  }

  const isActive = editor?.isActive('newFormat') || false

  return (
    <button onClick={handleClick} className={isActive ? 'active' : ''}>
      New
    </button>
  )
}
```

### Styling

The editor uses Tailwind CSS for styling:

- **Toolbar**: Existing toolbar with Tailwind classes
- **Editor Content**: TipTap content area with Tailwind styling
- **Theme Support**: Light and dark theme variants
- **Responsive**: Works on all screen sizes
- **Accessible**: Proper focus states and keyboard navigation

## Benefits of This Approach

### Advantages
1. **Minimal Changes**: Uses existing UI components and styling
2. **Powerful Engine**: TipTap's robust content management
3. **Consistent Design**: Maintains current design system
4. **Tailwind CSS**: No custom CSS files needed
5. **Easy Integration**: Simple ref-based editor sharing
6. **Extensible**: Easy to add new formatting options

### What We Kept
- Existing toolbar design and structure
- Tailwind CSS styling
- Current component architecture
- Theme system
- Auto-save functionality

### What We Added
- TipTap content management
- Rich text formatting capabilities
- JSON-based content structure
- Enhanced format buttons with active states

## Migration from Quill

If you were previously using Quill:

1. **Content Format**: TipTap uses JSON instead of HTML/Delta format
2. **API Changes**: The editor API is more React-friendly
3. **Styling**: Tailwind CSS instead of Quill's built-in styles
4. **Extensions**: More modular and extensible architecture
5. **UI**: Keeps existing UI components

## Performance

- **Bundle Size**: TipTap is lightweight and tree-shakeable
- **Rendering**: Efficient virtual DOM updates
- **Memory**: Minimal memory footprint
- **Collaboration**: Optimized for real-time collaboration
- **Existing UI**: No unnecessary UI code loaded

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Troubleshooting

### Common Issues

1. **Content not updating**: Ensure you're using the `onChange` callback
2. **Format buttons not working**: Check that editor instance is being passed correctly
3. **Theme not switching**: Verify the theme prop is being passed correctly
4. **Extensions not working**: Check that all required packages are installed

### Debug Mode

Enable debug logging by setting the environment variable:
```
DEBUG=tiptap:*
```

## Future Enhancements

- [ ] Add more format buttons (underline, headings, lists, etc.)
- [ ] Collaborative editing with Y.js
- [ ] More advanced formatting options
- [ ] Custom block types
- [ ] Table support
- [ ] Drawing and annotation tools
- [ ] Export to various formats (PDF, Word, etc.)
- [ ] Custom keyboard shortcuts
- [ ] Advanced toolbar features (dropdowns, color pickers, etc.) 