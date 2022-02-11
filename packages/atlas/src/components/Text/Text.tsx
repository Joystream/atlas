import React from 'react'

import { styledVariants } from './Text.styles'

export type TextVariant = keyof typeof styledVariants

export type TextProps = {
  variant: TextVariant
  color?: string
  secondary?: boolean
  className?: string
  clampAfterLine?: number
  as?: keyof JSX.IntrinsicElements
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>

export const Text = React.forwardRef<HTMLHeadingElement, TextProps>(
  ({ variant, secondary, as, ...otherProps }, ref) => {
    const Tag = styledVariants[variant]
    const FinalTag = as ? Tag.withComponent(as) : Tag
    return <FinalTag {...otherProps} isSecondary={secondary} ref={ref} />
  }
)
Text.displayName = 'Text'
