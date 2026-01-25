import { icons } from './icons'

export interface IconComponentProps {
	name: string
	className?: string
	onClick?: React.MouseEventHandler<SVGElement>
}

export function IconComponent(props: IconComponentProps) {
	const Icon = icons[props.name as keyof typeof icons]

	return Icon ? (
		<Icon
			onClick={props?.onClick}
			className={`richtext-h-4 richtext-w-4 ${props?.className || ''}`}
		/>
	) : null
}
