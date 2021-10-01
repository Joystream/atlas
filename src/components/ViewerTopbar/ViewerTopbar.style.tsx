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
  display: flex;
  width: 100%;
  align-items: center;

  > svg {
    display: none;
  }

  ${media.sm} {
    max-width: 1156px;
    justify-content: center;
    margin: 0;

    > svg {
      display: none;
    }
  }
`

export const StyledSearchbar = styled(Searchbar)<FocusProps>`
  transition: width ${transitions.timings.regular} ${transitions.easing};
  will-change: width;
  width: ${({ hasFocus }) => (hasFocus ? 'calc(100% - 57px)' : '42px')};
  padding-left: ${({ hasFocus }) => (hasFocus ? sizes(4) : 0)};
  margin-left: auto;
  height: 40px;
  margin-right: ${sizes(1)};

  ${media.sm} {
    max-width: 480px;
    width: 100%;
    margin-left: 0;
    height: initial;
    margin-right: 0;
  }
`

export const ButtonWrapper = styled.div`
  align-self: center;
  justify-self: flex-end;
`
