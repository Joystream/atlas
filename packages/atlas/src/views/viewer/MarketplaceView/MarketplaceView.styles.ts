import styled from '@emotion/styled'

import { cVar, media, sizes } from '@/styles'

export const MarketplaceWrapper = styled.div`
  padding: ${sizes(4)} 0;
  display: grid;
  gap: ${sizes(8)};
  ${media.md} {
    padding: ${sizes(8)} 0;
    gap: ${sizes(16)};
  }
`

export const TableFullWitdhtWrapper = styled.div`
  width: calc(100% + var(--size-global-horizontal-padding) * 2);
  margin-left: calc(var(--size-global-horizontal-padding) * -1);
  background-color: ${cVar('colorBackgroundMuted')};
  padding: ${sizes(8)} var(--size-global-horizontal-padding);

  ${media.md} {
    padding: ${sizes(16)} var(--size-global-horizontal-padding);
  }
`
