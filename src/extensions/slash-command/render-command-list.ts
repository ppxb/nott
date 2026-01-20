import { CommandList } from './types'

export function renderCommandList() {
	const groups: CommandList[] = [
		{
			name: 'style',
			title: 'Style',
			commands: []
		},
		{
			name: 'insert',
			title: 'Insert',
			commands: []
		},
		{
			name: 'upload',
			title: 'Upload',
			commands: []
		}
	]
}

export function useFilteredCommandList(
	commandList: CommandList[],
	query: string
) {
	const withFilteredCommands = commandList.map(group => ({
		...group,
		commands: group.commands.filter(item => {
			const labelNormalized = item.label.toLowerCase().trim()
			const queryNormalized = query.toLowerCase().trim()

			if (item.aliases) {
				const aliases = item.aliases.map(alias => alias.toLowerCase().trim())
				const labelMatch = labelNormalized.match(queryNormalized)
				const aliasMatch = aliases.some(alias => alias.match(queryNormalized))

				return labelMatch || aliasMatch
			}

			return labelNormalized.match(queryNormalized)
		})
	}))

	const withoutEmptyGroups = withFilteredCommands.filter(group => {
		if (group.commands.length > 0) {
			return true
		}
		return false
	})

	return withoutEmptyGroups
}
