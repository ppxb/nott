import { createSignal, useSignal } from 'reactjs-signal'
import { CommandList } from '@/extensions/slash-command/types'

const useCommandListStore = createSignal<CommandList[]>([])

export function useCommandList() {
	return useSignal(useCommandListStore)
}
