import React from 'react'

type Sizes = 'small' | 'medium' | 'large'
type Variants = 'default' | 'overlay' | 'danger'

export type PillProps = {
  label?: string
  icon?: React.ReactNode
  iconPlacement?: 'left' | 'right'
  size?: Sizes
  variant?: Variants
}
