import styled from '@emotion/styled'

import { colors, sizes } from '@/shared/theme'

export const TextContainer = styled.div`
  display: grid;
  grid-gap: ${sizes(4)};
  padding-bottom: ${sizes(8)};
  border-bottom: 1px solid ${colors.gray[600]};
`

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 312px;
`
