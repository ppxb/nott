import { Editor, Extension } from '@tiptap/core'
import type { BoldOptions as TiptapBoldOptions } from '@tiptap/extension-bold'
import { Bold as TipTapBold } from '@tiptap/extension-bold'
import { ActionButton } from '@/components/action-button'
import { GenericOptions } from '@/types/types'

export interface BoldOptions
	extends TiptapBoldOptions,
		GenericOptions<BoldOptions> {}

// TODO: SHOULD FIX RETURN TYPE
export const Bold = TipTapBold.extend({
	addOptions() {
		return {
			...this.parent?.(),
			button: ({
				editor,
				extension
			}: {
				editor: Editor
				extension: Extension
			}) => ({
				component: ActionButton,
				componentProps: {
					action: () => editor.commands.toggleBold(),
					isActive: () => editor.isActive('bold'),
					icon: 'Bold',
					shortcutKeys: extension.options.shortcutKeys ?? ['mod', 'B'],
					tooltip: ''
				}
			})
		}
	}
})
