import { HEADINGS } from '@/constants'
import { CommandList } from './types'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
type HeadingOption = 'Paragraph' | HeadingLevel

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

	HEADINGS.forEach((level: HeadingOption) => {
		groups[0].commands.push({
			name: `Heading ${level}`,
			label: `Heading ${level}`,
			aliases: [`h${level}`, `bt${level}`],
			iconName: `Heading${level}`,
			isActive: editor => {
				if (level === 'Paragraph') {
					return false
				}

				return editor.isActive('heading', { level }) || false
			},
			action: ({ editor, range }) => {
				const currentActiveLevel = HEADINGS.find(
					(lvl): lvl is HeadingLevel =>
						lvl !== 'Paragraph' &&
						editor.isActive('heading', { level: lvl as HeadingLevel })
				)

				if (level === 'Paragraph') {
					if (currentActiveLevel !== undefined) {
						editor.commands.toggleHeading({ level: currentActiveLevel })
						editor.chain().focus().deleteRange(range).run()
					} else {
						editor.chain().focus().deleteRange(range).run()
					}
					return
				}

				editor.chain().focus().deleteRange(range).setHeading({ level }).run()
			}
		})
	})

	return groups
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
