import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { sizes, zIndex } from '@/styles'

export const Wrapper = styled.div`
  position: relative;
`

export const Image = styled.img`
  object-fit: contain;
  width: 100%;
`

export const StyledText = styled(Text)`
  display: flex;
`

export const LogoWrapper = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  gap: ${sizes(6)};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: ${zIndex.overlay};
`

export const Fade = styled.div`
  position: absolute;
  bottom: 0;
  background: linear-gradient(180deg, rgb(24 28 32 / 0) 0%, #181c20 100%);
  width: 100%;
  height: 128px;
`
