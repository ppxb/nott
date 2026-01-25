export interface ButtonViewReturnComponentProps {
	action?: (value?: any) => void
	isActive?: () => boolean
	icon?: any
	tooltip?: string
	[x: string]: any
}

// TODO: SHOULD FIX BUTTON TYPE
export interface GenericOptions<T> {
	divider: boolean
	spacer: boolean
	button: any
	toolbar?: boolean
	shortcutKeys?: string[] | string[][]
}
