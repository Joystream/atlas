import React from 'react'

import { styledVariants } from './Text.style'

export type TextVariant = keyof typeof styledVariants

export type TextProps = {
  variant?: TextVariant
  secondary?: boolean
  className?: string
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>

export const Text = React.forwardRef<HTMLHeadingElement, TextProps>(
  ({ variant = 'body2', secondary, ...otherProps }, ref) => {
    const Tag = styledVariants[variant]
    return <Tag {...otherProps} isSecondary={secondary} ref={ref} />
  }
)
Text.displayName = 'Text'
