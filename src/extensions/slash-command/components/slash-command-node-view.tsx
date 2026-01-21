import { SuggestionKeyDownProps } from '@tiptap/suggestion'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
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
			return true
		}

		if (event.key === 'Enter') {
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
}
