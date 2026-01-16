import { Slot } from '@radix-ui/react-slot'
import type { TooltipContentProps } from '@radix-ui/react-tooltip'
import * as React from 'react'
import { cn, getShortcutKeys } from '@/lib/utils'
import type { ButtonViewReturnComponentProps } from '@/types/types'
import { icons } from './icons'
import { Toggle } from './ui/toggle'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export interface ActionButtonProps {
	title?: string
	icon?: string | undefined
	tooltip?: string
	disabled?: boolean
	shortcutKeys?: string[]
	customClass?: string
	loading?: boolean
	tooltipOptions?: TooltipContentProps
	color?: string
	action?: ButtonViewReturnComponentProps['action']
	isActive?: ButtonViewReturnComponentProps['isActive']
	children?: React.ReactNode
	asChild?: boolean
	upload?: boolean
	initialDisplayedColor?: string
	dataState?: boolean
}

export const ActionButton = React.forwardRef<
	HTMLButtonElement,
	Partial<ActionButtonProps>
>((props, ref) => {
	const {
		icon = undefined,
		tooltip = undefined,
		disabled = false,
		customClass = '',
		shortcutKeys = undefined,
		tooltipOptions = {},
		action = undefined,
		children,
		asChild = false,
		dataState = false,
		...rest
	} = props

	const Icon = icons[icon as keyof typeof icons]
	const Comp = asChild ? Slot : Toggle

	const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		if (disabled) {
			e.preventDefault()
			return
		}
		action?.(e)
	}
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Comp
					className={cn('w-8 h-8', customClass)}
					data-state={dataState ? 'on' : 'off'}
					disabled={disabled}
					onClick={onClick}
					ref={ref}
					size="sm"
					{...(rest as Omit<typeof rest, 'loading'>)}
				>
					{Icon && <Icon className="size-4" />}
					{children}
				</Comp>
			</TooltipTrigger>

			{tooltip && (
				<TooltipContent {...tooltipOptions} className="tooltip">
					<div className="flex max-w-24 flex-col items-center text-center">
						{tooltip}
						{!!shortcutKeys?.length && (
							<span>{getShortcutKeys(shortcutKeys)}</span>
						)}
					</div>
				</TooltipContent>
			)}
		</Tooltip>
	)
})
