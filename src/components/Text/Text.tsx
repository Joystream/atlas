import React from 'react'

import { styledVariants } from './Text.style'

export type TextVariant = keyof typeof styledVariants

export type TextProps = {
  variant?: TextVariant
  secondary?: boolean
  className?: string
  as?: keyof JSX.IntrinsicElements
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>

export const Text = React.forwardRef<HTMLHeadingElement, TextProps>(
  ({ variant = 'body2', secondary, as, ...otherProps }, ref) => {
    const Tag = styledVariants[variant]
    const FinalTag = as ? Tag.withComponent(as) : Tag
    return <FinalTag {...otherProps} isSecondary={secondary} ref={ref} />
  }
)
Text.displayName = 'Text'
