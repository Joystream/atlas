import * as React from 'react'

export type Sizes = 'small' | 'medium' | 'large'
export type Variants = 'default' | 'overlay' | 'danger'

export type PillProps = {
  label?: React.ReactNode
  icon?: React.ReactNode
  iconPlacement?: 'left' | 'right'
  size?: Sizes
  variant?: Variants
  title?: string
}
