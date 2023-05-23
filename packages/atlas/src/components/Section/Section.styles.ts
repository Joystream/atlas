import styled from '@emotion/styled'

import { media, sizes } from '@/styles'

export const SectionWrapper = styled.section<{ withoutGap?: boolean }>`
  display: grid;
  position: relative;
  gap: ${({ withoutGap }) => (withoutGap ? 0 : sizes(4))};
  ${media.sm} {
    gap: ${({ withoutGap }) => (withoutGap ? 0 : sizes(6))};
  }
`
