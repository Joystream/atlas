import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Dialog } from '@/components/_overlays/Dialog'
import { cVar, media, sizes, transitions, zIndex } from '@/styles'

export const StyledDialog = styled(Dialog)<{ bottomNavOpen: boolean }>`
  position: fixed;
  z-index: ${zIndex.globalOverlay};
  bottom: ${({ bottomNavOpen }) => sizes(bottomNavOpen ? 24 : 8)};
  left: ${sizes(4)};
  max-width: calc(100% - ${sizes(8)});
  transition: all ${cVar('animationTransitionMedium')}
    ${({ bottomNavOpen }) => (bottomNavOpen ? transitions.timings.routing : '0ms')};

  ${media.xs} {
    margin-left: 15px;
    max-width: calc(100% - 60px);
  }

  ${media.sm} {
    max-width: 320px;
  }

  ${media.md} {
    left: calc(var(--size-sidenav-width-collapsed) + 32px);
    bottom: ${sizes(8)};
  }
`

export const StyledAnchor = styled(Link)`
  text-decoration: none;
  color: ${cVar('colorTextPrimary')};
  display: block;
  margin-top: ${sizes(3)};
  margin-bottom: ${sizes(2)};
`

export const CookieEmoticon = styled.span`
  display: inline-block;
  margin-right: ${sizes(2)};
`
