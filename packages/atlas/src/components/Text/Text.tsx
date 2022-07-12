import { DetailedHTMLProps, HTMLAttributes, forwardRef } from 'react'

import { TextBaseProps, styledVariants } from './Text.styles'

export type TextVariant = keyof typeof styledVariants

export type TextProps = {
  variant: TextVariant
  className?: string
  clampAfterLine?: number
  as: keyof JSX.IntrinsicElements
} & TextBaseProps &
  DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>

export const Text = forwardRef<HTMLHeadingElement, TextProps>(({ variant, as, ...otherProps }, ref) => {
  const Tag = styledVariants[variant]
  return <Tag {...otherProps} as={as} ref={ref} />
})
Text.displayName = 'Text'
