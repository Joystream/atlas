import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { DismissibleBanner } from '@/shared/components/DismissibleBanner'
import { SkeletonLoader } from '@/shared/components/SkeletonLoader'
import { Text } from '@/shared/components/Text'
import { SvgGlyphAddVideo } from '@/shared/icons'
import { colors, media, sizes, transitions } from '@/shared/theme'

export const ViewContainer = styled.div`
  padding-top: ${sizes(8)};
`

export const TabsContainer = styled.div`
  padding-top: ${sizes(8)};
  margin-bottom: ${sizes(8)};
  border-bottom: solid 1px ${colors.gray[800]};

  ${media.md} {
    display: grid;
    grid-template-columns: 1fr 250px;
  }
`

export const PaginationContainer = styled.div`
  padding-top: ${sizes(6)};
  padding-bottom: ${sizes(16)};
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StyledDismissibleBanner = styled(DismissibleBanner)`
  margin-bottom: ${sizes(8)};
`

export const SortContainer = styled.div`
  display: none;
  grid-gap: 8px;
  grid-template-columns: auto 1fr;
  align-items: center;
  ${media.md} {
    display: grid;
  }
`

export const StyledIcon = styled(SvgGlyphAddVideo)`
  > path {
    transition: fill ${transitions.timings.player} ease-out;
    fill: ${colors.gray[500]};
  }
`

export const StyledText = styled(Text)`
  text-align: center;
  margin-top: ${sizes(2)};
  color: ${colors.gray[500]};
  transition: color ${transitions.timings.player} ease-out;
`

export const NewVideoTileWrapper = styled.div`
  width: 100%;
  height: 0;
  position: relative;

  /* 2px account for border */
  padding-bottom: calc(56.25% - 2px);
`

export const NewVideoTileLink = styled(Link)`
  position: absolute;
  background: none;
  border: 1px dashed ${colors.gray[500]};
  color: ${colors.gray[500]};
  transition: border ${transitions.timings.player} ease-out;
  width: 100%;
  height: 100%;
  cursor: pointer;

  :hover {
    border: 1px dashed ${colors.gray[200]};
    color: ${colors.gray[200]};
    ${StyledIcon} {
      > path {
        fill: ${colors.gray[200]};
      }
    }
    ${StyledText} {
      color: ${colors.gray[200]};
    }
  }
`

export const NewVideoTileSkeleton = styled(SkeletonLoader)`
  position: absolute;
  width: 100%;
`

export const TextAndIconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
