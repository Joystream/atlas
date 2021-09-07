import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { SkeletonLoader } from '@/shared/components/SkeletonLoader'
import { Text } from '@/shared/components/Text'
import { SvgGlyphAddVideo } from '@/shared/icons'
import { colors, sizes, transitions } from '@/shared/theme'

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
