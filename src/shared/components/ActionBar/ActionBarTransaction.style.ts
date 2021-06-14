import styled from '@emotion/styled'

import { media, transitions, zIndex } from '@/shared/theme'

import { Checkout } from '../Checkout'

type ActionBarTransactionWrapperProps = {
  fullWidth?: boolean
  isActive?: boolean
}

export const ActionBarTransactionWrapper = styled.div<ActionBarTransactionWrapperProps>`
  position: fixed;
  bottom: 0;
  left: ${({ fullWidth }) => (fullWidth ? 0 : 'var(--sidenav-collapsed-width)')};
  right: 0;
  z-index: ${zIndex.header};
  transition: transform ${transitions.timings.regular} ${transitions.easing};
  transform: translateY(${({ isActive }) => (isActive ? '0' : '100%')});

  &.${transitions.names.fade}-enter-active {
    transition: opacity ${transitions.timings.loading} ${transitions.easing} 800ms !important;
  }
`

export const StyledCheckout = styled(Checkout)`
  display: none;
  ${media.medium} {
    position: absolute;
    right: 0;
    bottom: 100%;
    display: block;
  }
`
