import styled from '@emotion/styled'

import { colors, media, sizes, zIndex } from '@/shared/theme'

export const TextWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${sizes(6)};
  height: ${sizes(6)};
  margin-right: ${sizes(2)};
`

export const IndicatorWrapper = styled.div`
  display: flex;
  position: fixed;
  top: calc(var(--size-topbar-height) + ${sizes(4)});
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 500px;
  align-items: center;
  z-index: ${zIndex.globalOverlay};
  background-color: ${colors.gray[600]};
  padding: ${sizes(3)} ${sizes(5)};
  ${media.md} {
    margin-left: var(--size-sidenav-width-collapsed);
  }
`
