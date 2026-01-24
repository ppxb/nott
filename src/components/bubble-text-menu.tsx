import { Editor } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'
import { BubbleMenu } from '@tiptap/react/menus'
import { Check } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { renderCommandList } from '@/extensions/slash-command/render-command-list'
import { useEditorEditable, useEditorInstance } from '@/store/editor'
import { ActionButton } from './action-button'

function TurnIntoMenu() {
	const [open, setOpen] = useState(false)
	const editor = useEditorInstance()

	const items = useMemo(() => {
		return renderCommandList()[0].commands
	}, [])

	const label = useMemo(() => {
		const label = items.find(item => item.isActive?.(editor))?.label
		return label
	}, [editor.state.selection.ranges, open, editor, items])

	return (
		<Popover modal onOpenChange={setOpen} open={open}>
			<PopoverTrigger
				asChild
				className="hover:bg-accent data-[state=on]:bg-accent"
			>
				<ActionButton dataState={!!label}>
					{label ? <>{label}</> : null}
				</ActionButton>
			</PopoverTrigger>

			<PopoverContent
				align="start"
				className="w-[initial]! p-1"
				hideWhenDetached
				side="bottom"
			>
				{items.map(item => {
					const isActive = item.isActive?.(editor)

					return (
						<div
							className="flex w-full items-center gap-3 rounded-sm border-none! bg-transparent! px-2 py-1.5 text-left text-sm text-foreground outline-none! transition-colors hover:bg-accent!"
							key={item.name}
							onClick={e => {
								e.preventDefault()
								item.action({
									editor,
									range: editor.state.selection.ranges as any
								})
								setOpen(false)
							}}
						>
							<div className="min-w-[20px]!">
								{isActive && <Check size={16} />}
								{!label && !isActive && <Check size={16} />}
							</div>

							<div className="flex items-center gap-1">
								{/* {item.iconName && (
									<IconComponent
										className="mr-1! text-lg!"
										name={item.iconName}
									/>
								)} */}

								{item.label}
							</div>
						</div>
					)
				})}
			</PopoverContent>
		</Popover>
	)
}

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

	if (!editable) {
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
