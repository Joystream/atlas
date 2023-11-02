import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { FlexBox } from '@/components/FlexBox'
import { LayoutGrid } from '@/components/LayoutGrid'
import { cVar, media, sizes } from '@/styles'

export const StyledListContainer = styled(FlexBox)`
  margin-top: ${sizes(24)};
  padding: ${sizes(8)};
  border-radius: calc(4 * ${cVar('radiusLarge')});
  background: ${`linear-gradient(to bottom, ${cVar('colorCoreBaseBlack')} 0%, ${cVar('colorBackgroundPrimary')} 60%) `};
  width: 100%;

  ${media.sm} {
    height: 300px;
    padding: 0 ${sizes(8)};
  }

  ${media.md} {
    height: 360px;
  }

  ${media.lg} {
    height: 380px;
  }
`

const scroll = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-74%);
  }
`

export const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  min-height: 160px;

  ${media.xs} {
    min-height: 250px;
  }
  ${media.sm} {
    min-height: 100%;
  }
`
export const StyledScrollingListImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  max-width: 100%;
  animation: ${scroll} 20s linear infinite;
`

export const TextContainer = styled(FlexBox)`
  height: 100%;
`

export const StyledContentGrid = styled(LayoutGrid)`
  min-height: 100%;
  width: 100%;
`
