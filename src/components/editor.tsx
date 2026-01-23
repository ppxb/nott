import { Dropcursor, Placeholder } from '@tiptap/extensions'
import { Markdown } from '@tiptap/markdown'
import type { Editor } from '@tiptap/react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useState } from 'react'
import { SlashCommand } from '@/extensions/slash-command'
import { SlashCommandList } from '@/extensions/slash-command/components/slash-command-list'
import BubbleFloatingMenu from './bubble-floating-menu'
import { EditorProvider } from './provider/editor-provider'

export default function NottEditor() {
	const [serializedContent, setSerializedContent] = useState('')

	const updateContent = useCallback((editor: Editor) => {
		const markdown = editor.getMarkdown()
		setSerializedContent(markdown)
	}, [])

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				dropcursor: false
			}),
			Markdown,
			Dropcursor.configure({
				color: '#f00',
				width: 2
			}),
			Placeholder.configure({
				placeholder: "Write, type '/' for commands..."
			}),
			SlashCommand
		],
		content: '',
		autofocus: 'end',
		editorProps: {
			handlePaste: (_, event) => {
				const text = event.clipboardData?.getData('text/plain')
				if (!text) {
					return false
				}

				const hasMarkdown =
					/^#{1,6}\s|^\*{1,2}[^*]|^_{1,2}[^_]|^\[.*\]\(.*\)|^```|^>|^[-*+]\s|^\d+\.\s/m.test(
						text
					)
				if (hasMarkdown && editor) {
					event.preventDefault()

					const { from, to } = editor.state.selection
					if (from !== to) {
						editor.commands.deleteSelection()
					}

					editor.commands.insertContent(text, { contentType: 'markdown' })
					return true
				}

				return false
			}
		},
		onUpdate: ({ editor }) => {
			const { doc } = editor.state
			let hasContent = false
			const emptyParaPositions: number[] = []

			doc.descendants((node, pos) => {
				if (node.type.name === 'paragraph') {
					if (node.content.size === 0) {
						emptyParaPositions.push(pos)
					} else {
						hasContent = true
					}
				} else if (node.isBlock && node.type.name !== 'doc') {
					hasContent = true
				}
			})

			if (!hasContent && emptyParaPositions.length > 1) {
				const { tr } = editor.state

				for (let i = emptyParaPositions.length - 1; i > 0; i--) {
					const pos = emptyParaPositions[i]
					const node = editor.state.doc.nodeAt(pos)
					if (
						node &&
						node.type.name === 'paragraph' &&
						node.content.size === 0
					) {
						tr.delete(pos, pos + node.nodeSize)
					}
				}

				if (tr.docChanged) {
					editor.view.dispatch(tr)
				}
			}

			updateContent(editor)
		},
		onCreate: ({ editor }) => {
			updateContent(editor)
		}
	})

	return (
		<div className="flex flex-col h-screen w-full bg-gray-50">
			<div className="flex-1 overflow-auto bg-white">
				<EditorProvider editor={editor}>
					<BubbleFloatingMenu />
					<SlashCommandList />
					<EditorContent editor={editor} className="w-full" />
				</EditorProvider>
			</div>
			<div className="h-[40vh] shrink-0 overflow-auto bg-gray-100 p-2">
				<h3 className="text-sm font-semibold text-gray-600 mb-3">
					Markdown Preview
				</h3>
				<pre className="text-sm text-gray-800 whitespace-pre-wrap">
					{serializedContent}
				</pre>
			</div>
		</div>
	)
}
