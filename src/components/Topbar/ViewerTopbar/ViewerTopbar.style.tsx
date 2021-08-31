import styled from '@emotion/styled'

import { Searchbar } from '@/shared/components/Searchbar'
import { colors, media, sizes, transitions } from '@/shared/theme'

import { TopbarBase } from '../TopbarBase'

type FocusProps = {
  hasFocus: boolean
}

export const StyledTopbarBase = styled(TopbarBase)<FocusProps>`
  transition: background-color 0.4s ${transitions.easing};
  background-color: ${(props) => (props.hasFocus ? colors.gray[900] : colors.black)};
`

export const SearchbarContainer = styled.div`
  max-width: 1156px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: ${sizes(14)};

  ${media.sm} {
    margin: 0;
  }
`

export const StyledSearchbar = styled(Searchbar)<FocusProps>`
  transition: max-width ${transitions.timings.regular} ${transitions.easing};
  will-change: max-width;
  height: 42px;
  width: 100%;
  max-width: ${(props) => (props.hasFocus ? '100%' : '385px')};

  ${media.sm} {
    height: initial;
  }
`
