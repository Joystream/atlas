import React from 'react'
import { secondaryTextStyles, styledVariants } from './Text.style'

type TextVariant = keyof typeof styledVariants

export type TextProps = {
  variant?: TextVariant
  secondary?: boolean
  className?: string
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>

const Text = React.forwardRef<HTMLHeadingElement, TextProps>(({ variant = 'body2', secondary, ...otherProps }, ref) => {
  const Tag = styledVariants[variant]
  return <Tag {...otherProps} css={secondary && secondaryTextStyles} ref={ref} />
})
Text.displayName = 'Text'

export default Text
