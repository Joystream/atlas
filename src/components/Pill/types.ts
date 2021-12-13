import React from 'react'

export type Sizes = 'small' | 'medium' | 'large'
type Variants = 'default' | 'overlay' | 'danger'

export type PillProps = {
  label?: string | number
  icon?: React.ReactNode
  iconPlacement?: 'left' | 'right'
  size?: Sizes
  variant?: Variants
}
