import styled from '@emotion/styled'

import { colors, media, sizes } from '@/shared/theme'

export const Container = styled.div`
  margin-top: ${sizes(16)};
`

export const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${sizes(4)};
  align-items: center;
  padding-bottom: ${sizes(4)};
  border-bottom: 1px solid ${colors.gray[700]};

  ${media.md} {
    grid-template-columns: auto 160px 1fr 242px;
  }
`

export const SortContainer = styled.div`
  padding-left: ${sizes(4)};
  display: grid;
  grid-gap: 8px;
  align-items: center;
  grid-template-columns: 1fr;
  ${media.xs} {
    grid-template-columns: auto 1fr;
    grid-area: initial;
  }
`
