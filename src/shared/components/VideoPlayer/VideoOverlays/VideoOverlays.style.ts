import styled from '@emotion/styled'

import { Text } from '@/shared/components/Text'
import { colors, media, sizes, zIndex } from '@/shared/theme'

export const OverlayBackground = styled.div`
  display: flex;
  z-index: ${zIndex.nearOverlay};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${colors.gray[900]};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
`

export const InnerContainer = styled.div`
  padding: ${sizes(4)};
  overflow-y: auto;
  width: 100%;

  ${media.sm} {
    padding: ${sizes(6)};
  }
`

export const OverlayHeading = styled(Text)`
  margin-top: ${sizes(8)};
  text-align: center;
`

export const OverlayContent = styled(Text)`
  max-width: 560px;
  margin: ${sizes(2)} auto;
  text-align: center;
`
