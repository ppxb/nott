import type { Editor } from '@tiptap/core'
import { EditorContext } from '@tiptap/react'
import { useEffect, useId } from 'react'
import { EditorEditableInject } from '@/components/editor-editable-inject'
import { TooltipProvider } from '@/components/ui/tooltip'
import { BusProvider } from './bus-provider'

interface EditorProviderProps {
	editor: Editor
	children: React.ReactNode
	dark?: boolean
}

export function EditorProvider({ editor, children }: EditorProviderProps) {
	const id = useId()

	useEffect(() => {
		if (editor) {
			editor.id = id
		}
	}, [editor, id])

	return (
		<BusProvider>
			<EditorContext value={{ editor }}>
				<TooltipProvider delayDuration={0} disableHoverableContent>
					{children}
				</TooltipProvider>

				<EditorEditableInject editor={editor} />
			</EditorContext>
		</BusProvider>
	)
}
