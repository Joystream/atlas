import { ReactNode } from 'react'

export type Sizes = 'small' | 'medium' | 'large'
export type Variants = 'default' | 'overlay' | 'danger'

export type PillProps = {
  label?: ReactNode
  icon?: ReactNode
  iconPlacement?: 'left' | 'right'
  size?: Sizes
  variant?: Variants
  title?: string
}
