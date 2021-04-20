import { TOP_NAVBAR_HEIGHT } from '@/components'
import { studioContainerStyle } from '@/components/StudioContainer'
import { colors, media, sizes, zIndex } from '@/shared/theme'
import styled from '@emotion/styled'
import { animated } from 'react-spring'
import { ActionBarTransaction } from '@/shared/components'

export const Container = styled(animated.div)`
  position: fixed;
  z-index: ${zIndex.nearOverlay};
  top: ${TOP_NAVBAR_HEIGHT}px;
  left: var(--sidenav-collapsed-width);
  right: 0;
  height: calc(100vh - ${TOP_NAVBAR_HEIGHT}px);

  display: flex;
  flex-direction: column;

  background-color: ${colors.gray[900]};
  box-shadow: 0 4px 52px ${colors.black};
`

export const Content = styled.div`
  display: grid;
  grid-template-rows: max-content max-content;
  grid-template-columns: 100%;
  overflow-y: auto;

  padding: ${sizes(8)} ${sizes(4)};

  ${media.small} {
    padding: ${sizes(8)} ${sizes(8)};
  }

  ${media.medium} {
    overflow-y: hidden;
    padding-bottom: 0;
    grid-gap: ${sizes(12)};
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr;
  }

  ${media.large} {
    padding: ${sizes(8)} 0 0 0;
  }

  ${studioContainerStyle}
`

export const DrawerOverlay = styled(animated.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${colors.transparentBlack[66]};
  pointer-events: none;
`

export const StyledActionBar = styled(ActionBarTransaction)`
  position: initial;
`
