import styled from '@emotion/styled'
import { animated } from 'react-spring'

import { TOP_NAVBAR_HEIGHT } from '@/components'
import { ActionBarTransaction } from '@/shared/components'
import { colors, zIndex } from '@/shared/theme'

export const Container = styled(animated.div)`
  position: fixed;
  z-index: ${zIndex.sheetOverlay};
  top: ${TOP_NAVBAR_HEIGHT}px;
  left: var(--sidenav-collapsed-width);
  right: 0;
  height: calc(100vh - ${TOP_NAVBAR_HEIGHT}px);

  display: flex;
  flex-direction: column;

  background-color: ${colors.gray[900]};
  box-shadow: 0 4px 52px ${colors.black};
`

export const DrawerOverlay = styled(animated.div)`
  position: fixed;
  z-index: ${zIndex.sheetOverlay};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${colors.transparentBlack[66]};
`

export const StyledActionBar = styled(ActionBarTransaction)`
  position: initial;
`
