import { Button, Text } from '@/shared/components'
import { breakpoints, colors, sizes, zIndex } from '@/shared/theme'
import styled from '@emotion/styled'
import { ReactComponent as BackgroundPatternSVG } from '@/assets/bg-pattern.svg'
import tileImg from '@/assets/tile-example.png'
import videoImg from '@/assets/video-example.png'

export const StyledBackgroundPattern = styled(BackgroundPatternSVG)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${zIndex.background};
  max-width: 100%;
  transform: translateX(0);
  @media screen and (min-width: ${breakpoints.small}) {
    left: 50%;
    transform: translateX(-50%);
  }
`

export const SignInWrapper = styled.div`
  width: 100%;
  overflow-x: hidden;
`
export const Header = styled.header`
  margin-top: ${sizes(20)};
  max-width: 710px;
`

export const ButtonGroup = styled.div`
  margin-top: ${sizes(12)};
`
export const SignInButton = styled(Button)`
  margin-right: ${sizes(3)};
  margin-bottom: ${sizes(3)};
`

export const SubTitle = styled(Text)`
  margin-top: ${sizes(4)};
  color: ${colors.gray[400]};
`

export const CompositionWrapper = styled.div`
  position: absolute;
  width: 100%;
  z-index: ${zIndex.background};
  right: ${sizes(8)};
  top: 0;
`
export const VideoImgBg = styled.div`
  background-image: url(${videoImg});
  margin-top: ${sizes(10)};
  position: absolute;
  width: 100%;
  height: 250px;
  left: 30px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top right;
  @media screen and (min-width: ${breakpoints.small}) {
    left: 0;
    height: 350px;
  }
`

export const TileImgBg = styled.div`
  margin-top: ${sizes(10)};
  position: absolute;
  width: 100%;
  height: 200px;
  top: 120px;
  left: 30px;
  background: url(${tileImg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top left;
  @media screen and (min-width: ${breakpoints.small}) {
    right: 70px;
    top: 190px;
    left: initial;
    width: 340px;
    height: 280px;
  }
`

export const Tile = styled.img``

export const Overlay = styled.div`
  z-index: ${zIndex.background};
  position: absolute;
  top: 0;
  left: -32px;
  background: radial-gradient(100% 200% at 0% 100%, black 0%, rgba(0, 0, 0, 0.53) 100%);
  width: 100vw;
  height: 150%;
  overflow: hidden;
  @media screen and (min-width: ${breakpoints.small}) {
    width: 100%;
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    background: radial-gradient(100% 200% at 0% 100%, black 0%, rgba(0, 0, 0, 0) 100%);
    width: 70%;
    left: 20%;
  }
`
