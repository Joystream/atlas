import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { cVar, media, sizes, zIndex } from '@/styles'

export const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${zIndex.header};
  min-height: var(--size-topbar-height);
  max-height: var(--size-topbar-height);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${cVar('effectDividersBottom')};
  background-color: ${cVar('colorCoreBaseBlack')};

  /* add left padding to reserve space for sidenav hamburger button */
  padding: ${sizes(3)} calc(${sizes(4)} + var(--size-scrollbar-width)) ${sizes(3)}
    calc(${sizes(4)} + 48px + ${sizes(2)});

  ${media.md} {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: 1fr minmax(480px, 1fr) 1fr;
    padding: ${sizes(4)} calc(${sizes(8)} + var(--size-scrollbar-width)) ${sizes(4)}
      calc(var(--size-sidenav-width-collapsed) + ${sizes(8)});
  }
`

export const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;

  /* increase the clickable area */
  padding: 16px;
  margin: -16px;
`
