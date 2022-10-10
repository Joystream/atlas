import { FC } from 'react'

import { Icon } from './CategoryIcon.styles'

type SvgIconProps = {
  url?: string
  color?: string
  className?: string
}

export const CategoryIcon: FC<SvgIconProps> = ({ url, color, className }) => {
  return <Icon className={className} url={url} color={color} />
}
