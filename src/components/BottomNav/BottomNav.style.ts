import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { Link, PathMatch } from 'react-router-dom'

import { colors, sizes, typography, zIndex } from '@/shared/theme'
import { animation } from '@/shared/theme/tokens'

export const Container = styled.div`
  width: 100%;
  height: 64px;
  background-color: ${colors.gray[800]};
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: ${zIndex.nearSheetOverlay};
  display: flex;
  transition: all ${animation.medium.timing} ${animation.medium.easing};

  &.bottom-nav-active,
  &.bottom-nav-exit {
    bottom: 0;
  }

  &.bottom-nav-exit-active,
  &.bottom-nav-enter {
    bottom: -64px;
  }
`

export const NavLink = styled(Link, { shouldForwardProp: isPropValid })<{ active: PathMatch | null }>`
  color: ${colors.white};
  font-size: ${typography.sizes.button.small};
  text-align: center;
  text-decoration: none;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 ${sizes(2.5)};
  flex: 1;

  ${({ active }) => active && `background-color: ${colors.transparentPrimary[18]}`};

  > svg {
    margin: 0 auto;
  }
`

export const NavTitle = styled.span`
  min-width: 56px;
  margin-top: ${sizes(1)};
`
