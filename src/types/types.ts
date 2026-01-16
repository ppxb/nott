export interface ButtonViewReturnComponentProps {
  action?: (value?: any) => void
  isActive?: () => boolean
  icon?: any
  tooltip?: string
  [x: string]: any
}
