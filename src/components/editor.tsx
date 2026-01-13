import type { Editor } from '@tiptap/react'
import { Placeholder } from '@tiptap/extensions'
import { Markdown } from '@tiptap/markdown'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useState } from 'react'

export default function NottEditor() {
  const [serializedContent, setSerializedContent] = useState('')

  const updateContent = useCallback((editor: Editor) => {
    const markdown = editor.getMarkdown()
    setSerializedContent(markdown)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
      Placeholder.configure({
        placeholder: 'Write, type \'/\' for commands...',
      }),
    ],
    content: '',
    autofocus: 'end',
    editorProps: {
      handlePaste: (_, event) => {
        const text = event.clipboardData?.getData('text/plain')
        if (!text) {
          return false
        }

        const hasMarkdown = /^#{1,6}\s|^\*{1,2}[^*]|^_{1,2}[^_]|^\[.*\]\(.*\)|^```|^>|^[-*+]\s|^\d+\.\s/m.test(text)
        if (hasMarkdown && editor) {
          event.preventDefault()

          const { from, to } = editor.state.selection
          if (from !== to) {
            editor.commands.deleteRange({ from, to: editor.state.selection.to })
          }

          editor.commands.insertContent(text, { contentType: 'markdown' })
          return true
        }

        return false
      },
    },
    onUpdate: ({ editor }) => {
      updateContent(editor)
    },
    onCreate: ({ editor }) => {
      updateContent(editor)
    },
  })

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      <div className="flex-1 overflow-auto bg-white">
        <EditorContent editor={editor} />
      </div>
      <div className="h-[40vh] shrink-0 overflow-auto bg-gray-100 p-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Markdown Preview</h3>
        <pre className="text-sm text-gray-800 whitespace-pre-wrap">
          {serializedContent}
        </pre>
      </div>
    </div>
  )
}
