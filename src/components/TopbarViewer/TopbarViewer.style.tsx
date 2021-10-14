import styled from '@emotion/styled'

import { IconButton } from '@/shared/components/IconButton'
import { colors, media, sizes, square, transitions, zIndex } from '@/shared/theme'

import { TopbarBase } from '../TopbarBase'

type FocusProps = {
  hasFocus: boolean
}

export const StyledTopbarBase = styled(TopbarBase)<FocusProps>`
  transition: background-color 0.4s ${transitions.easing};
  background-color: ${({ hasFocus }) => (hasFocus ? colors.gray[900] : colors.black)};
  ${({ hasFocus }) => hasFocus && `z-index: ${zIndex.globalOverlay}`};
`

export const SearchbarContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  z-index: ${zIndex.globalOverlay};

  > svg {
    display: none;
  }

  ${media.md} {
    max-width: 480px;
    justify-content: center;
    margin: 0;

    > svg {
      display: none;
    }
  }
`

export const ButtonWrapper = styled.div`
  align-self: center;
  justify-self: flex-end;
  flex-shrink: 0;
`

export const Overlay = styled.div`
  ${square('100%')};

  position: fixed;
  top: 0;
  left: 0;
  background-color: ${colors.transparentBlack[54]};
  display: none;

  ${media.sm} {
    display: block;
  }
`

export const StyledIconButton = styled(IconButton)`
  margin-left: ${sizes(2)};
`
