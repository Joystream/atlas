import styled from '@emotion/styled/dist/emotion-styled.cjs'

import { Text } from '@/components/Text'
import { sizes } from '@/styles'

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
`
