import styled from '@emotion/styled'
import { ReactNode } from 'react'

import { SvgActionCreatorToken, SvgActionVerified } from '@/assets/icons'
import { Text, TextVariant } from '@/components/Text'
import { TextBaseProps } from '@/components/Text/Text.styles'
import { cVar, media } from '@/styles'

import { FlexBox } from '../FlexBox'

type ChannelTitleProps = {
  variant: TextVariant
  isVerified?: boolean
  hasToken?: boolean
  children?: ReactNode
  as: keyof JSX.IntrinsicElements
  className?: string
} & TextBaseProps

// todo: add isVerified and CRT flag for each instance
export const ChannelTitle = ({ isVerified, hasToken, ...titleProps }: ChannelTitleProps) => {
  return (
    <StyledFlexBox alignItems="center">
      <ChannelTitleText {...titleProps} />
      {hasToken && <SvgActionCreatorToken />}
      {isVerified && <SvgActionVerified />}
    </StyledFlexBox>
  )
}

export const ChannelTitleText = styled(Text)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const StyledFlexBox = styled(FlexBox)`
  justify-content: center;

  path {
    fill: ${cVar('colorText')};
  }

  ${media.sm} {
    justify-content: start;
  }
`
