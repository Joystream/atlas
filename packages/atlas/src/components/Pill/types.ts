import { ReactNode } from 'react'

export type Sizes = 'small' | 'medium' | 'large'
export type Variants = 'default' | 'overlay' | 'danger' | 'success'

export type PillProps = {
  label?: ReactNode
  icon?: ReactNode
  iconPlacement?: 'left' | 'right'
  size?: Sizes
  variant?: Variants
  title?: string
  withTooltip?: boolean
  round?: boolean
}
