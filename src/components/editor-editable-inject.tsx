import type { Editor } from '@tiptap/core'
import { useEffect } from 'react'
import { useSetEditorEditable } from '@/store/editor'

interface EditorEditableInjectProps {
	editor: Editor
}

export function EditorEditableInject({ editor }: EditorEditableInjectProps) {
	const setEditable = useSetEditorEditable()

	useEffect(() => {
		setEditable(editor.isEditable)
	}, [editor.isEditable])

	const onEditableChange = () => {
		setEditable(editor.isEditable)
	}

	useEffect(() => {
		if (editor) {
			editor.on('update', onEditableChange)
		}

		return () => {
			if (editor) {
				editor.off('update', onEditableChange)
			}
		}
	}, [editor])

	return null
}
