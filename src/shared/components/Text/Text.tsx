import React from 'react'
import { styledVariants } from './Text.style'

type TextVariant = keyof typeof styledVariants

type TextProps = {
  variant?: TextVariant
  className?: string
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>

const Text: React.ForwardRefRenderFunction<HTMLHeadingElement, TextProps> = (
  { variant = 'body2', ...otherProps },
  ref
) => {
  const Tag = styledVariants[variant]
  return <Tag {...otherProps} ref={ref} />
}

export default React.forwardRef(Text)
