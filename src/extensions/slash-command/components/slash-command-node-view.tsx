import { SuggestionKeyDownProps } from '@tiptap/suggestion'
import {
	Fragment,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState
} from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useCommandList } from '@/store/command-list'
import { useFilteredCommandList } from '../render-command-list'

function SlashCommandNodeView(props: any, ref: any) {
	const [commandList] = useCommandList()
	const [selectedCommandIndex, setSelectedCommandIndex] = useState(0)
	const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)
	const scrollContainer = useRef<HTMLDivElement | null>(null)

	const commandQuery = useFilteredCommandList(commandList, props.query)

	const activeItemRefs = useRef<(HTMLButtonElement | null)[]>([])

	useImperativeHandle(ref, () => {
		return {
			onKeyDown
		}
	})

	useEffect(() => {
		if (!scrollContainer.current) {
			return
		}

		const activeItemIndex = selectedGroupIndex * 1000 + selectedCommandIndex
		const activeItem = activeItemRefs.current[activeItemIndex]
		if (activeItem) {
			activeItem.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest'
			})
		}
	}, [selectedCommandIndex, selectedGroupIndex])

	function onKeyDown({ event }: SuggestionKeyDownProps) {
		if (event.key === 'ArrowUp') {
			upHandler()
			return true
		}

		if (event.key === 'ArrowDown') {
			downHandler()
			return true
		}

		if (event.key === 'Enter') {
			enterHandler()
			return true
		}

		return false
	}

	function upHandler() {
		if (commandQuery.length === 0) {
			return false
		}

		let newCommandIndex = selectedCommandIndex - 1
		let newGroupIndex = selectedGroupIndex

		if (newCommandIndex < 0) {
			newGroupIndex = selectedGroupIndex - 1

			if (newGroupIndex < 0) {
				newGroupIndex = commandQuery.length - 1
			}
			newCommandIndex = commandQuery[newGroupIndex].commands.length - 1
		}

		setSelectedCommandIndex(newCommandIndex)
		setSelectedGroupIndex(newGroupIndex)
	}

	function downHandler() {
		if (commandQuery.length === 0) {
			return false
		}

		const commands = commandQuery[selectedGroupIndex].commands
		let newCommandIndex = selectedCommandIndex + 1
		let newGroupIndex = selectedGroupIndex

		if (commands.length - 1 < newCommandIndex) {
			newCommandIndex = 0
			newGroupIndex = selectedGroupIndex + 1
		}
		if (commandQuery.length - 1 < newGroupIndex) {
			newGroupIndex = 0
		}
		setSelectedCommandIndex(newCommandIndex)
		setSelectedGroupIndex(newGroupIndex)
	}

	function enterHandler() {
		if (
			commandQuery.length === 0 ||
			selectedGroupIndex === -1 ||
			selectedCommandIndex === -1
		) {
			return false
		}

		selectItem(selectedGroupIndex, selectedCommandIndex)
	}

	function selectItem(groupIndex: number, commandIndex: number) {
		const command = commandQuery[groupIndex].commands[commandIndex]
		props?.command(command)
	}

	function createCommandClickHandler(groupIndex: number, commandIndex: number) {
		selectItem(groupIndex, commandIndex)
	}

	function setActiveItemRef(groupIndex: number, cmomandIndex: number, el: any) {
		activeItemRefs.current[groupIndex * 1000 + cmomandIndex] = el
	}

	return (
		<div
			className="max-h-[min(80vh,24rem)] flex-wrap overflow-y-auto overflow-x-hidden rounded-md border! border-solid! border-border! bg-popover p-1 text-popover-foreground shadow-md outline-none"
			data-nott-portal
			ref={scrollContainer}
		>
			{commandQuery?.length ? (
				<div className="grid min-w-48 grid-cols-1 gap-0.5">
					{commandQuery?.map((group, groupIndex) => {
						return (
							<Fragment key={`slash-${group.title}`}>
								<Label className="mx-[4px] mb-[4px] mt-[8px] text-[0.65rem]! uppercase">
									{group.title}
								</Label>

								{group.commands.map((command, commandIndex) => {
									return (
										<button
											key={`command-${commandIndex}`}
											onClick={() =>
												createCommandClickHandler(groupIndex, commandIndex)
											}
											ref={el => setActiveItemRef(groupIndex, commandIndex, el)}
											className={cn(
												'flex w-full items-center gap-3 rounded-sm border-none! bg-transparent! px-2 py-1.5 text-left text-sm text-foreground outline-none! transition-colors hover:bg-accent!',
												{
													'bg-item-active':
														selectedGroupIndex === groupIndex &&
														selectedCommandIndex === commandIndex
												}
											)}
										>
											{command.iconUrl && (
												<img alt="" className="size-6" src={command.iconUrl} />
											)}

											{/* {command.iconName && (
												<IconComponent
													className="mr-1! text-lg!"
													name={command.iconName}
												/>
											)} */}

											{command.label}
										</button>
									)
								})}
							</Fragment>
						)
					})}
				</div>
			) : (
				<div className="p-3">
					<span className="text-xs text-foreground">No Result</span>
				</div>
			)}
		</div>
	)
}

export default forwardRef(SlashCommandNodeView)
