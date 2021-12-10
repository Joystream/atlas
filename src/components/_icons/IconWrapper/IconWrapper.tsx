import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React from 'react'

import { cVar, sizes } from '@/styles'

export type IconWrapperProps = {
  size?: 'small' | 'medium' | 'large'
  icon: React.ReactNode
}

export const IconWrapper: React.FC<IconWrapperProps> = ({ size = 'medium', icon }) => {
  return <IconContainer size={size}>{icon}</IconContainer>
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
type IconContainerProps = Omit<IconWrapperProps, 'icon'>
const IconContainer = styled.div<IconContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: min-content;
  border-radius: 100%;
  background: ${cVar('colorBackgroundAlpha')};

  ${getIconContainerPaddingStyles}
`
