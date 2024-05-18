import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export const UnclickableWrapper = styled.div`
  cursor: pointer;
  width: auto;

  > * {
    pointer-events: none;
  }
`

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(4)};
  background-color: ${cVar('colorBackgroundStrong')};
  padding: ${sizes(4)};
  border-radius: ${cVar('radiusMedium')};
`

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(2)};
`

export const Title = styled(Text)`
  white-space: nowrap;
`
export const Description = styled(Text)`
  white-space: nowrap;
`
