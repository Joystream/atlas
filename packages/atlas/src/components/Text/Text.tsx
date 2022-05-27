import { DetailedHTMLProps, HTMLAttributes, forwardRef } from 'react'

import { TextBaseProps, styledVariants } from './Text.styles'

export type TextVariant = keyof typeof styledVariants

export type TextProps = {
  variant: TextVariant
  className?: string
  clampAfterLine?: number
  as?: keyof JSX.IntrinsicElements
} & TextBaseProps &
  DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>

export const Text = forwardRef<HTMLHeadingElement, TextProps>(({ variant, secondary, as, ...otherProps }, ref) => {
  const Tag = styledVariants[variant]
  const FinalTag = as ? Tag.withComponent(as) : Tag
  return <FinalTag {...otherProps} secondary={secondary} ref={ref} />
})
Text.displayName = 'Text'
