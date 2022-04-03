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

export const SparksBackgroundMask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  mask-position: 50% 50%;
  transition: all 0.1s ease;
  mask-image: linear-gradient(
    104deg,
    rgb(0 0 0 / 1) 0%,
    rgb(0 0 0 / 1) 5%,
    rgb(0 0 0 / 0.2) 20%,
    rgb(0 0 0 / 0) 40%,
    rgb(0 0 0 / 0) 60%,
    rgb(0 0 0 / 0.2) 80%,
    rgb(0 0 0 / 1) 95%,
    rgb(0 0 0 / 1) 100%
  );
  mask-size: 250%;
  mask-mode: alpha;
`

export const SparksBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-image: url('https://i.imgur.com/AjBArhU.png');
  background-position: 50% 50%;
  background-size: 300%;
  z-index: 2;
  transition: all 0.1s ease;
  mask-image: url('https://i.imgur.com/Y9uPQ9n.png');
  mask-position: 50% 50%;
`

export const GradientBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-position: 50% 50%;
  background-size: 300% 300%;
  opacity: 0;
  transition: background-position 0.1s ease;
  filter: brightness(0.5) contrast(1.2);
  background-image: linear-gradient(
    70deg,
    rgba(0 0 0 / 0) 15%,
    ${cVar('colorCoreNeutral900Lighten')} 30%,
    ${cVar('colorCoreNeutral600Lighten')} 48%,
    ${cVar('colorCoreNeutral600Lighten')} 52%,
    ${cVar('colorCoreNeutral900Lighten')} 70%,
    rgba(0 0 0 / 0) 85%
  );
`

export const ReflectionContent = styled.div`
  transform: rotateX(0) rotateY(0);
  transition: transform 300ms, box-shadow 300ms;
  box-shadow: 0 0 0 0 ${cVar('colorCoreNeutral600')}, 0 55px 35px -60px rgb(0 0 0 / 0.5);
`

const generateEdges = (num: number) => {
  if (num > 6) {
    return -3
  }
  if (num < 2) {
    return 2
  }
  if (num < 3) {
    return 3
  }
  return 0
}

export const ReflectionGridCell = styled.div<{
  row: number
  column: number
  lp: number
  tp: number
}>`
  position: absolute;
  z-index: 1;
  width: 10%;
  height: 10%;
  :hover ~ ${ReflectionContent} {
    transform: rotateX(${({ row }) => row * -5 + 25}deg) rotateY(${({ column }) => -25 + column * 5}deg);
    box-shadow: ${({ row, column }) =>
        `${generateEdges(column)}px ${generateEdges(row)}px 0 0 ${cVar('colorCoreNeutral600')}`},
      0 55px 35px -20px rgb(0 0 0 / 0.5);
  }
  :hover ~ ${ReflectionContent} ${SparksBackground} {
    opacity: 1;
    background-position: ${({ lp, tp }) => `${lp}% ${tp}%`};
  }
  :hover ~ ${ReflectionContent} ${SparksBackgroundMask} {
    opacity: 1;
    mask-position: ${({ lp, tp }) => `${lp}% ${tp}%`};
  }
  :hover ~ ${ReflectionContent} ${GradientBackground} {
    opacity: 1;
    background-position: ${({ lp, tp }) => `${lp}% ${tp}%`};
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
