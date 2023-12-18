import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { media, sizes } from '@/styles'

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: ${sizes(4)};
  padding: ${sizes(4)};
  ${media.sm} {
    padding: ${sizes(6)};
  }
`

export const HorizontalContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${media.sm} {
    width: auto;
    gap: ${sizes(4)};
    justify-content: unset;
  }
`

export const PageInfo = styled(Text)`
  white-space: nowrap;
`
