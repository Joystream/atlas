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

export const FadeMask = styled.div`
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
    rgb(0 0 0 / 1) 7%,
    rgb(0 0 0 / 0.5) 10%,
    rgb(0 0 0 / 0) 40%,
    rgb(0 0 0 / 0) 60%,
    rgb(0 0 0 / 0.5) 90%,
    rgb(0 0 0 / 1) 92%,
    rgb(0 0 0 / 1) 100%
  );
  mask-size: 300%;
  mask-mode: alpha;
`

export const Pattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-image: url('https://i.imgur.com/AjBArhU.png');
  background-position: 50% 50%;
  background-size: 1000%;
  z-index: 2;
  transition: all 0.1s ease;
  mask-image: url('https://i.imgur.com/Y9uPQ9n.png');
  mask-position: 50% 50%;
`

export const LightReflection = styled.div`
  --color1: #efb2fb;
  --color2: #acc6f8;

  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0.5;
  transition: all 0.33s ease;
  mix-blend-mode: color-dodge;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: 300% 300%;
  background-image: linear-gradient(
    115deg,
    transparent 0%,
    var(--color1) 25%,
    transparent 47%,
    transparent 53%,
    var(--color2) 75%,
    transparent 100%
  );
  opacity: 0.5;
  filter: brightness(0.5) contrast(1);
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
  transform: translateZ(80px);
  width: 10%;
  height: 10%;
  :hover ~ ${ReflectionContent} {
    transform: rotateX(${({ row }) => row * -5 + 25}deg) rotateY(${({ column }) => -25 + column * 5}deg);
    box-shadow: ${({ row, column }) =>
        `${generateEdges(column)}px ${generateEdges(row)}px 0 0 ${cVar('colorCoreNeutral600')}`},
      0 55px 35px -20px rgb(0 0 0 / 0.5);
  }
  :hover ~ ${ReflectionContent} ${Pattern} {
    opacity: 0.65;
    background-position: ${({ lp, tp }) => `${lp * 0.25}% ${tp * 0.5}%`};
  }
  :hover ~ ${ReflectionContent} ${FadeMask} {
    opacity: 1;
    mask-position: ${({ lp, tp }) => `${lp * 1.15}% ${tp}%`};
    mask-image: linear-gradient(
      104deg,
      rgb(0 0 0 / 1) 0%,
      rgb(0 0 0 / 0.8) 10%,
      rgb(0 0 0 / 0) 35%,
      rgb(0 0 0 / 0) 65%,
      rgb(0 0 0 / 0.8) 90%,
      rgb(0 0 0 / 1) 100%
    );
    mask-size: 190%;
  }
  :hover ~ ${ReflectionContent} ${LightReflection} {
    background-position: ${({ lp, tp }) => `${lp}% ${tp}%`};
    background-image: linear-gradient(110deg, transparent 25%, var(--color1) 48%, var(--color2) 52%, transparent 75%);
    opacity: 0.628;
    filter: brightness(0.66) contrast(1.33);
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
