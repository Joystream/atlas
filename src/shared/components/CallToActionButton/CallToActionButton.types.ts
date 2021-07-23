import { To } from 'history'
import { MouseEvent, ReactNode } from 'react'

export type ColorVariants = 'red' | 'green' | 'yellow' | 'blue'

export type CallToActionButtonProps = {
  to?: To
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  icon?: ReactNode
  colorVariant?: ColorVariants
  label: string
}
