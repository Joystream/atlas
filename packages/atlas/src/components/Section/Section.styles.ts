import styled from '@emotion/styled'

import { media, sizes } from '@/styles'

export const SectionWrapper = styled.section`
  display: grid;
  gap: ${sizes(4)};
  ${media.sm} {
    gap: ${sizes(6)};
  }
`
