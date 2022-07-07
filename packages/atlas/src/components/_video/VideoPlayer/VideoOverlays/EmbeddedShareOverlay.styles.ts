import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { breakpoints, cVar, sizes, zIndex } from '@/styles'

export const OverlayBackground = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${cVar('colorCoreNeutral700Darken')};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  z-index: ${zIndex.nearOverlay};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const CloseButton = styled(Button)`
  position: absolute;
  right: ${sizes(4)};
  top: ${sizes(4)};

  @media (hover: hover) and (min-width: ${breakpoints.xs}) {
    right: ${sizes(6)};
    top: ${sizes(6)};
  }
`

export const EmbeddedShareWrapper = styled.div`
  padding: 0 56px;
  width: 100%;
  display: grid;
  gap: ${sizes(6)};
  justify-items: center;
  @media (hover: hover) and (min-width: ${breakpoints.xs}) {
    max-width: 376px;
    padding: 0;
    gap: ${sizes(10)};
  }
`

export const ShareTitle = styled(Text)`
  display: none;

  @media (hover: hover) and (min-width: ${breakpoints.xs}) {
    display: block;
  }
`
