import styled from '@emotion/styled'

import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { WidgetTile } from '@/components/WidgetTile'
import { cVar, media, sizes, zIndex } from '@/styles'

export const CustomNodeWrapper = styled.div`
  display: grid;
  justify-content: start;
  grid-template-columns: auto auto;
  gap: ${sizes(2)};
`

export const AvatarAndTokenWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const TokenWrapper = styled.div`
  position: relative;
  left: -4px;
  z-index: ${zIndex.overlay};
  margin-right: ${sizes(2)};

  /* token background */

  &::before {
    content: '';
    position: absolute;
    width: 28px;
    height: 28px;
    background-color: ${cVar('colorBackgroundMuted')};
    border-radius: 100%;
    left: -2px;
    top: -2px;
  }
`
export const StyledJoyTokenIcon = styled(JoyTokenIcon)`
  position: relative;
`

export const TilesWrapper = styled.div`
  display: grid;
  gap: ${sizes(4)};
  margin-bottom: ${sizes(4)};
  grid-template-rows: repeat(3, 1fr);

  ${media.sm} {
    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.md} {
    grid-template-rows: unset;
    grid-template-columns: repeat(3, 1fr);
  }
`

export const StyledWidgetTile = styled(WidgetTile)`
  ${media.sm} {
    grid-column: 1/3;
  }
  ${media.md} {
    grid-column: unset;
  }
`
