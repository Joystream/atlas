import React from 'react'
import { styledVariants } from './Text.style'

type TextVariant = keyof typeof styledVariants

export type TextProps = {
  variant?: TextVariant
  className?: string
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>

const Text = React.forwardRef<HTMLHeadingElement, TextProps>(({ variant = 'body2', ...otherProps }, ref) => {
  const Tag = styledVariants[variant]
  return <Tag {...otherProps} ref={ref} />
})
Text.displayName = 'Text'

export default Text
