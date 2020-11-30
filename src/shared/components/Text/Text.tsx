import React from 'react'
import { styledVariants } from './Text.style'

type TextVariant =
  | 'hero'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overhead'

type TextProps = {
  variant?: TextVariant
  className?: string
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>

const Text: React.FC<TextProps> = ({ variant = 'body2', ...otherProps }) => {
  const Tag = styledVariants[variant]
  return <Tag {...otherProps} />
}

export default Text
