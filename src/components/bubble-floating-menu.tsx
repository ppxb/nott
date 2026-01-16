import type { Editor } from '@tiptap/core'
import DragHandle from '@tiptap/extension-drag-handle-react'
import type { Node } from '@tiptap/pm/model'
import { useCallback, useState } from 'react'
import { useEditorEditable, useEditorInstance } from '@/store/editor'
import { ActionButton } from './action-button'

export default function BubbleFloatingMenu() {
	const editor = useEditorInstance()
	const editable = useEditorEditable()

	const [currentNode, setCurrentNode] = useState<Node | null>(null)
	const [currentNodePos, setCurrentNodePos] = useState(-1)

	const handleNodeChange = useCallback(
		(data: { node: Node | null; editor: Editor; pos: number }) => {
			if (data.node) {
				setCurrentNode(data.node)
			}
			setCurrentNodePos(data.pos)
		},
		[]
	)

	const handleAddClick = () => {
		// TODO
	}

	const handleDragClick = useCallback((e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		console.log('Drag clicked')
	}, [])

	if (!editor) {
		return null
	}

	return (
		<DragHandle
			editor={editor}
			onNodeChange={handleNodeChange}
			pluginKey="BubbleFloatingMenu"
		>
			<div className="flex items-center gap-0.5 mr-2">
				<ActionButton
					action={handleAddClick}
					disabled={!editable}
					icon="Plus"
					tooltip="Insert Block"
				/>

				<ActionButton
					disabled={!editable}
					icon="Grip"
					tooltip="Click for options, Hold for drag"
					action={handleDragClick}
				/>
			</div>
		</DragHandle>
	)
}
