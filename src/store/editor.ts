import type { Editor } from '@tiptap/core'
import {
	useCurrentEditor,
	useEditorState as useTiptapEditorState
} from '@tiptap/react'
import { useMemo } from 'react'
import { createSignal, useSetSignal, useSignalValue } from 'reactjs-signal'

function useTiptapEditor(providedEditor?: Editor | null) {
	const { editor: coreEditor } = useCurrentEditor()
	const editor = useMemo(
		() => providedEditor || coreEditor,
		[providedEditor, coreEditor]
	)

	if (!editor) {
		throw new Error(
			'Editor not found. Make sure the component is used within EditorProvider.'
		)
	}
	return editor
}

export function useEditorInstance(providedEditor?: Editor) {
	return useTiptapEditor(providedEditor)
}

export function useEditorState(providedEditor?: Editor) {
	const editor = useTiptapEditor(providedEditor)

	return useTiptapEditorState({
		editor,
		selector: context => context.editor?.state
	})
}

export function useCanCommand(providedEditor?: Editor) {
	const editor = useTiptapEditor(providedEditor)

	return useTiptapEditorState({
		editor,
		selector: context => context.editor?.can
	})
}

const editorEditableSignal = createSignal(false)

export function useEditorEditable() {
	return useSignalValue(editorEditableSignal)
}

export function useSetEditorEditable() {
	return useSetSignal(editorEditableSignal)
}
