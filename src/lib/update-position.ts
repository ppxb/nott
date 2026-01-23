import type { FloatingElement } from '@floating-ui/dom'
import { computePosition, flip, shift } from '@floating-ui/dom'
import { Editor, posToDOMRect } from '@tiptap/core'

export function updatePosition(editor: Editor, element: FloatingElement) {
	const virtualEl = {
		getBoundingClientRect: () =>
			posToDOMRect(
				editor.view,
				editor.state.selection.from,
				editor.state.selection.to
			)
	}

	computePosition(virtualEl, element, {
		placement: 'bottom-start',
		strategy: 'absolute',
		middleware: [shift(), flip()]
	})
		.then(({ x, y, strategy }) => {
			element.style.width = 'max-content'
			element.style.position = strategy
			element.style.left = `${x}px`
			element.style.top = `${y}px`
		})
		.catch(_ => {})
}
