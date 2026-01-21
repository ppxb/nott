import { useEffect } from 'react'
import { useCommandList } from '@/store/command-list'
import { renderCommandList } from '../render-command-list'
import { CommandList } from '../types'

interface SlashCommandListProps {
	commandList?: CommandList[]
}

export function SlashCommandList({ commandList }: SlashCommandListProps) {
	const [_, setCommandList] = useCommandList()

	useEffect(() => {
		if (!commandList?.length) {
			const defaultCommands = renderCommandList()
			setCommandList(defaultCommands)
			return
		}

		setCommandList(commandList as CommandList[])
	}, [commandList])

	return null
}
