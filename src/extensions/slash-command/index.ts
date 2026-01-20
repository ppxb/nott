import { Editor, Extension, Range } from '@tiptap/core'
import { PluginKey } from '@tiptap/pm/state'
import { ReactRenderer } from '@tiptap/react'
import { Suggestion } from '@tiptap/suggestion'
import { updatePosition } from '@/lib/update-position'
import { Command } from './types'

export const SlashCommand = Extension.create({
	name: 'EditorSlashCommand',
	priority: 200,

	addProseMirrorPlugins() {
		return [
			Suggestion({
				pluginKey: new PluginKey('SlashCommandPlugin'),
				editor: this.editor,
				char: '/',

				command: ({
					editor,
					range,
					props
				}: {
					editor: Editor
					range: Range
					props: Command
				}) => {
					const { view } = editor
					props.action({ editor, range })
					view.focus()
				},

				render: () => {
					let reactRenderer: ReactRenderer

					return {
						onStart: props => {
							if (!props.clientRect) {
								return
							}

							reactRenderer = new ReactRenderer(null, {
								props,
								editor: props.editor
							})

							reactRenderer.element.style.position = 'absolute'
							document.body.appendChild(reactRenderer.element)
							updatePosition(props.editor, reactRenderer.element)
						},
						onUpdate: props => {
							reactRenderer.updateProps(props)
							if (!props.clientRect) {
								return
							}
							updatePosition(props.editor, reactRenderer.element)
						},
						onKeyDown: props => {
							if (props.event.key === 'Escape') {
								reactRenderer.destroy()
								reactRenderer.element.remove()
								return true
							}
							return (reactRenderer.ref as any).onKeyDown(props)
						},
						onExit: () => {
							if (!reactRenderer) {
								return
							}
							reactRenderer.destroy()
							reactRenderer.element.remove()
						}
					}
				}
			})
		]
	}
})
