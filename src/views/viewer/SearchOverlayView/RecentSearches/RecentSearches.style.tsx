import styled from '@emotion/styled'

import { Text } from '@/shared/components/Text'
import { sizes } from '@/shared/theme'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${sizes(14)};
  padding: 0 var(--global-horizontal-padding);
`
export const Title = styled(Text)`
  font-size: 4rem;
`

export const SearchesList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: ${sizes(16)};
`
