import styled from '@emotion/styled'

import { Select } from '@/shared/components/Select'
import { colors, media, sizes } from '@/shared/theme'

import { InfiniteVideoGrid } from '../../../components/InfiniteGrids'

export const Container = styled.div`
  /* margin-top: ${sizes(16)}; */

  /* todo remove line below and uncomment above when layout is ready */
  margin-top: ${sizes(32)};
`

export const StyledSticky = styled.div`
  /* ignore global horizontal padding */
  width: calc(100% + calc(2 * var(--size-global-horizontal-padding)));
  margin-left: calc(-1 * var(--size-global-horizontal-padding));
  position: sticky;
  z-index: 50;
`

export const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${sizes(4)};
  align-items: center;
  /* readd global horizontal padding to the component */
  padding: ${sizes(4)} var(--size-global-horizontal-padding);
  border-bottom: 1px solid ${colors.gray[700]};
  background-color: ${colors.black};

  ${media.sm} {
    grid-template-columns: auto 160px 1fr 242px;
  }
`

export const SortContainer = styled.div`
  display: grid;
  grid-gap: 8px;
  align-items: center;
  grid-template-columns: 1fr;
  grid-column-end: span 2;

  ${media.sm} {
    grid-template-columns: auto 1fr;
    grid-area: initial;
    padding-left: ${sizes(4)};
  }
`

export const StyledVideoGrid = styled(InfiniteVideoGrid)`
  position: relative;
  padding-top: ${sizes(12)};
`

export const StyledSelect = styled(Select)`
  ul {
    z-index: 500;
  }
` as typeof Select
