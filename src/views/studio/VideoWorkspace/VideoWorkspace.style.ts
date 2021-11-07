import styled from '@emotion/styled'
import { animated } from 'react-spring'

import { colors, zIndex } from '@/theme'

export const Container = styled(animated.div)`
  position: fixed;
  z-index: ${zIndex.videoWorkspaceOverlay};
  top: var(--size-topbar-height);
  left: var(--size-sidenav-width-collapsed);
  right: 0;
  height: calc(100vh - var(--size-topbar-height));
  display: flex;
  flex-direction: column;
  background-color: ${colors.gray[900]};
  box-shadow: 0 4px 52px ${colors.black};
`

export const DrawerOverlay = styled(animated.div)`
  position: fixed;
  z-index: ${zIndex.videoWorkspaceOverlay};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${colors.transparentBlack[54]};
`
