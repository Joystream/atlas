import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { AvatarGroup } from '@/components/Avatar/AvatarGroup'
import { Text } from '@/components/Text'
import { cVar, media, sizes } from '@/styles'

export const Container = styled.div<{ fullWidth?: boolean }>`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '360px')};
  transform-style: preserve-3d;
  perspective: 1000px;
  position: relative;
`

export const ReflectionContent = styled.div`
  transform: rotateX(0) rotateY(0);
  transition: 100ms linear transform;
  box-shadow: transparent -7px -7px 10px -5px, transparent 7px 7px 10px -5px, rgb(255 255 255 / 0) 0 0 5px 0,
    rgb(0 0 0 / 0.5) 0 55px 35px -20px;
`

export const ReflectionGridCell = styled.div<{
  row: number
  column: number
  lp: number
  tp: number
  pxSpark: number
  pySpark: number
}>`
  position: absolute;
  z-index: 1;
  width: 10%;
  height: 10%;
  :hover ~ ${ReflectionContent} {
    transform: rotateX(${({ row }) => row * -5 + 25}deg) rotateY(${({ column }) => -25 + column * 5}deg);
  }
`

export const Title = styled(Text)`
  margin-bottom: ${sizes(4)};

  ${media.sm} {
    margin-bottom: ${sizes(6)};
  }
`

export const Details = styled.div`
  padding: ${sizes(4)};
  background-color: ${cVar('colorBackgroundStrong')};

  ${media.sm} {
    padding: ${sizes(6)};
  }
`

export const Content = styled.div`
  display: grid;

  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
`

export const MembersWrapper = styled.div`
  padding: ${sizes(4)} 0;
  grid-column: 1 / span 2;

  &:last-of-type {
    padding-bottom: 0;
  }

  &:first-of-type {
    padding-top: 0;
    padding-bottom: 0;
  }

  ${media.sm} {
    grid-column: unset;

    &:nth-of-type(even) {
      border: 0;
      padding-top: 0;
      justify-self: flex-end;
    }
  }
`

export const Separator = styled.hr`
  grid-column: 1 / span 2;
  background-color: ${cVar('colorBorderMutedAlpha')};
  border: 0;
  height: 1px;
  width: 100%;
`

export const Caption = styled(Text)`
  display: block;
  margin-bottom: ${sizes(2)};
`

export const AvatarGroupWrapper = styled.div`
  display: flex;
  align-items: center;

  ${media.sm} {
    justify-content: flex-end;
  }
`

export const AvatarWrapper = styled.div`
  display: flex;
`

export const StyledAvatarGroup = styled(AvatarGroup)`
  margin-right: ${sizes(1)};
`

export const StyledAvatar = styled(Avatar)`
  margin-right: ${sizes(2)};
`

export const MemberName = styled(Text)`
  word-break: break-word;
`
