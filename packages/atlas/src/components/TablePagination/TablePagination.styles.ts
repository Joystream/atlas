import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { sizes } from '@/styles'

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${sizes(4)};
  padding: ${sizes(6)};
`

export const HorizontalContainer = styled.div`
  display: flex;
  gap: ${sizes(4)};
  align-items: center;
`

export const PageInfo = styled(Text)`
  white-space: nowrap;
`
