import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { Link, PathMatch } from 'react-router-dom'

import { Text } from '@/shared/components/Text'
import { colors, sizes, typography, zIndex } from '@/shared/theme'
import { animation } from '@/shared/theme/tokens'

export const Container = styled.div`
  width: 100%;
  height: 64px;
  background-color: ${colors.gray[800]};
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: ${zIndex.nearVideoWorkspaceOverlay};
  display: flex;
  transition: transform ${animation.medium.timing}ms ${animation.medium.easing};

  &.bottom-nav-active,
  &.bottom-nav-exit {
    transform: translateY(0);
  }

  &.bottom-nav-exit-active,
  &.bottom-nav-enter {
    transform: translateY(100%);
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
  align-items: center;
  padding: 0 ${sizes(2.5)};
  flex: 1;

  ${({ active }) => active && `background-color: ${colors.transparentPrimary[18]}`};
`

export const NavTitle = styled(Text)`
  min-width: 56px;
  margin-top: ${sizes(1)};
`
