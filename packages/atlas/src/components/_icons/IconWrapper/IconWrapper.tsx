import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { FC, ReactNode } from 'react'

import { cVar, sizes } from '@/styles'

export type IconWrapperProps = {
  size?: 'small' | 'medium' | 'large'
  icon: ReactNode
  destructive?: boolean
  className?: string
}

export const IconWrapper: FC<IconWrapperProps> = ({ size = 'medium', icon, destructive, className }) => {
  return (
    <IconContainer className={className} size={size} destructive={destructive}>
      {icon}
    </IconContainer>
  )
}

const getIconContainerPaddingStyles = ({ size }: IconContainerProps) => {
  switch (size) {
    case 'large':
      return css`
        padding: ${sizes(3)};
      `
    case 'medium':
      return css`
        padding: ${sizes(2)};
      `
    case 'small':
      return css`
        padding: ${sizes(1)};
      `
  }
}

const destructiveIconStyles = css`
  > svg > path {
    fill: ${cVar('colorTextError')};
  }
`

type IconContainerProps = Omit<IconWrapperProps, 'icon'>
const IconContainer = styled.div<IconContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: min-content;
  border-radius: 100%;
  background: ${cVar('colorBackgroundAlpha')};

  ${getIconContainerPaddingStyles}
  ${({ destructive }) => destructive && destructiveIconStyles};
`
