import { Editor } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'
import { BubbleMenu } from '@tiptap/react/menus'
import { useEditorEditable, useEditorInstance } from '@/store/editor'

interface BubbleTextMenuProps {
	buttonBubble?: React.ReactNode
}

export function BubbleTextMenu({ buttonBubble }: BubbleTextMenuProps) {
	const editor = useEditorInstance()
	const editable = useEditorEditable()

	const shouldShow = ({ editor }: { editor: Editor }) => {
		const { selection } = editor.view.state
		const { $from, to } = selection

		if ($from.pos === to) {
			return false
		}

		return selection instanceof TextSelection
	}

	if (!editor || !editable) {
		return null
	}

	return (
		<BubbleMenu
			editor={editor}
			options={{
				placement: 'top',
				flip: true
			}}
			pluginKey="BubbleTextMenu"
			shouldShow={shouldShow}
		></BubbleMenu>
	)
}
