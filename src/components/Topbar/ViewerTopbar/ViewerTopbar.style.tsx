import styled from '@emotion/styled'

import Searchbar from '@/shared/components/Searchbar'
import { sizes, transitions, media } from '@/shared/theme'

export const SearchbarContainer = styled.div`
  max-width: 1156px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: ${sizes(14)};

  ${media.small} {
    margin: 0;
  }
`

export const StyledSearchbar = styled(Searchbar)`
  transition: max-width ${transitions.timings.regular} ${transitions.easing};
  will-change: max-width;
  height: 42px;

  ${media.small} {
    height: initial;
  }
`
