import { media, transitions } from '@/shared/theme'
import styled from '@emotion/styled'
import Checkout from '../Checkout'

type ActionBarTransactionWrapperProps = {
  fullWidth?: boolean
  isActive?: boolean
}

export const ActionBarTransactionWrapper = styled.div<ActionBarTransactionWrapperProps>`
  position: fixed;
  bottom: 0;
  left: ${({ fullWidth }) => (fullWidth ? 0 : 'var(--sidenav-collapsed-width);')};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'calc(100% - var(--sidenav-collapsed-width))')};

  transition: transform ${transitions.timings.regular} ${transitions.easing};
  transform: translateY(${({ isActive }) => (isActive ? '0' : '100%')});
`

export const StyledCheckout = styled(Checkout)`
  margin-left: auto;
  display: none;
  ${media.medium} {
    display: block;
  }
`
