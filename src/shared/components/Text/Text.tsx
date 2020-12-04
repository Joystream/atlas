import React from 'react'
import { styledVariants } from './Text.style'

type TextVariant = keyof typeof styledVariants

type TextProps = {
  variant?: TextVariant
  className?: string
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>

const Text: React.FC<TextProps> = ({ variant = 'body2', ...otherProps }) => {
  const Tag = styledVariants[variant]
  return <Tag {...otherProps} />
}

export default Text
