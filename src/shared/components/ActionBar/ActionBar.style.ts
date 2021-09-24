import styled from '@emotion/styled'

import { colors, media, sizes, transitions, zIndex } from '@/shared/theme'

import { Button } from '../Button'
import { Text } from '../Text'

export const FlexWrapper = styled.div`
  display: flex;
  height: 40px;
  justify-content: space-between;
  ${media.sm} {
    height: 48px;
  }
`

export const ActionBarContainer = styled.div<{ isActive?: boolean }>`
  background-color: ${colors.gray[900]};
  border-top: 1px solid ${colors.gray[700]};
  display: grid;
  padding: ${sizes(4)};
  grid-template-rows: auto auto;
  grid-template-columns: 1fr;
  z-index: ${zIndex.header};
  transition: transform ${transitions.timings.regular} ${transitions.easing};
  transform: translateY(${({ isActive }) => (isActive ? '0' : '100%')});
  &.${transitions.names.fade}-enter-active {
    transition: opacity ${transitions.timings.loading} ${transitions.easing} 800ms !important;
  }
  ${media.sm} {
    display: flex;
    justify-content: space-between;
    padding: ${sizes(4)} ${sizes(8)};
  }
`

export const StyledPrimaryText = styled(Text)`
  margin-right: ${sizes(5)};
  align-self: center;
`

type ActionButtonPrimaryProps = {
  isMobile?: boolean
}

export const ActionButtonPrimary = styled(Button)<ActionButtonPrimaryProps>`
  margin-left: ${({ isMobile }) => (isMobile ? 0 : sizes(4))};
  margin-top: ${({ isMobile }) => (isMobile ? sizes(4) : 0)};
`

export const StyledSecondaryText = styled(Text)`
  display: none;
  ${media.lg} {
    max-width: 360px;
    align-self: center;
    display: block;
  }
`

export const DraftsBadgeContainer = styled.div`
  user-select: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  height: 100%;
  padding: ${sizes(4)} 0;
  transition: background-color ${transitions.timings.sharp} ${transitions.easing};

  ${media.sm} {
    padding: 0 ${sizes(4)};

    :hover {
      background-color: ${colors.transparentPrimary[18]};
    }
  }
`

export const DetailsIconWrapper = styled.span`
  margin-left: ${sizes(2)};
`

export const ActionBarTransactionWrapper = styled.div<{ isActive: boolean }>`
  position: fixed;
  bottom: 0;
  right: 0;
`
