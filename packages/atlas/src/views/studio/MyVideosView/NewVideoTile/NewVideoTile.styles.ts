import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Text } from '@/components/Text'
import { SvgActionAddVideo } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, sizes, transitions } from '@/styles'

export const StyledIcon = styled(SvgActionAddVideo)`
  > path {
    transition: fill ${transitions.timings.player} ease-out;
    fill: ${cVar('colorCoreNeutral500')};
  }
`

export const StyledText = styled(Text)`
  text-align: center;
  margin-top: ${sizes(2)};
  color: ${cVar('colorCoreNeutral500')};
  transition: color ${transitions.timings.player} ease-out;
`

export const NewVideoTileWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

export const NewVideoTileLink = styled(Link)`
  position: absolute;
  background: none;
  border: 1px dashed ${cVar('colorCoreNeutral500')};
  color: ${cVar('colorCoreNeutral500')};
  transition: border ${transitions.timings.player} ease-out;
  width: 100%;
  height: 100%;
  cursor: pointer;

  :hover {
    border: 1px dashed ${cVar('colorCoreNeutral200')};
    color: ${cVar('colorCoreNeutral200')};
    ${StyledIcon} {
      > path {
        fill: ${cVar('colorCoreNeutral200')};
      }
    }
    ${StyledText} {
      color: ${cVar('colorCoreNeutral200')};
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
