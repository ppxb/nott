import { SuggestionKeyDownProps } from '@tiptap/suggestion'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useCommandList } from '@/store/command-list'

function SlashCommandNodeView(props: any, ref: any) {
	const [commandList] = useCommandList()
	const [selectedCommandIndex, setSelectedCommandIndex] = useState(0)
	const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)
	const scrollContainer = useRef<HTMLDivElement | null>(null)

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
}
