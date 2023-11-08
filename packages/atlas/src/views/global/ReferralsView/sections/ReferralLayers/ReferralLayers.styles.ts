import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { FlexBox, FlexBoxProps } from '@/components/FlexBox'
import { media } from '@/styles'

export const StyledReferralLayersWrapper = styled.div`
  pointer-events: none;
  position: relative;
  display: grid;
  align-items: flex-start;
  justify-items: center;
  justify-content: center;
  grid-template-columns: fit-content(177px) fit-content(88px) fit-content(177px);
  grid-template-rows: fit-content(88px) fit-content(58px) fit-content(68px) fit-content(58px) fit-content(60px);
`

export const StyledPositionedImage = styled.img<{
  [key: string]: string | number
}>`
  position: relative;
  top: ${({ top }) => top};
  right: ${({ right }) => right};
  left: ${({ left }) => left};

  ${({ height }) => height && `height: ${height};`};
  ${({ width }) => width && `width: ${width};`};
  ${({ transform }) => transform && `transform: ${transform};`};
  ${({ borderRadius }) => borderRadius && `border-radius: ${borderRadius};`};
  ${({ gridRow }) => gridRow && `grid-row-start: ${gridRow};`};
  ${({ gridColumn }) => gridColumn && `grid-column-start: ${gridColumn};`};
  ${({ justifySelf }) => justifySelf && `justify-self: ${justifySelf};`};
`

export const StyledUserAvatar = styled(Avatar)`
  grid-row-start: 1;
  grid-column-start: 2;
`

export const StyledPositionedAvatar = styled(StyledPositionedImage)`
  height: 32px;
  width: 32px;
  border-radius: 100%;

  ${media.xs} {
    height: 44px;
    width: 44px;
  }

  ${media.sm} {
    height: 60px;
    width: 60px;
  }
`

export const StyledInviteeAvatar = styled(StyledPositionedAvatar)`
  position: relative;
`

export const StyledDemoInviteeWrapper = styled(FlexBox)<
  FlexBoxProps & {
    alt: string
    top?: string
    right?: string
    left?: string
    gridRow?: number
    gridColumn?: number
    justifySelf?: string
  }
>`
  position: relative;
  width: fit-content;
  top: ${({ top }) => top};
  right: ${({ right }) => right};
  left: ${({ left }) => left};
  ${({ justifySelf }) => justifySelf && `justify-self: ${justifySelf};`};
  ${({ gridRow }) => gridRow && `grid-row-start: ${gridRow};`};
  ${({ gridColumn }) => gridColumn && `grid-column-start: ${gridColumn};`};
`
