import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { Button } from '@/components/_buttons/Button'
import { cVar, media, sizes, transitions, zIndex } from '@/styles'

type ActionBarContainerProps = {
  isActive?: boolean
}

export const ActionBarContainer = styled.div<ActionBarContainerProps>`
  background-color: ${cVar('colorBackground')};
  box-shadow: ${cVar('effectDividersTop')};
  display: grid;
  gap: ${sizes(4)};
  padding: ${sizes(4)};
  z-index: ${zIndex.transactionBar};
  transform: translateY(${({ isActive }) => (isActive ? '0' : '100%')});
  transition: transform ${transitions.timings.regular} ${transitions.easing};

  &.${transitions.names.fade}-enter-active {
    transition: opacity ${transitions.timings.loading} ${transitions.easing} 800ms !important;
  }

  grid-template:
    'primary-text badge' auto
    'secondary-button primary-button' auto / auto 1fr;

  ${media.sm} {
    grid-template: 'primary-text badge secondary-button primary-button' auto / 1fr max-content max-content max-content;
  }

  ${media.md} {
    padding: ${sizes(4)} ${sizes(8)};
  }

  ${media.lg} {
    grid-template: 'primary-text secondary-text badge secondary-button primary-button' auto / max-content 1fr max-content max-content max-content;
  }
`

export const StyledPrimaryText = styled(Text)`
  grid-area: primary-text;
  align-self: center;
  padding: 6px 0;
`

export const StyledSecondaryText = styled(Text)`
  display: none;
  ${media.lg} {
    grid-area: secondary-text;
    max-width: 320px;
    align-self: center;
    display: block;
  }
`

export const ActionButtonPrimaryTooltip = styled(Tooltip)`
  grid-area: primary-button;
`

export const ActionButtonPrimary = styled(Button)`
  grid-area: primary-button;

  &:first-of-type {
    grid-column: 1 / span 2;
  }

  ${media.sm} {
    &:first-of-type {
      grid-column: 3;
    }
  }

  ${media.lg} {
    &:first-of-type {
      grid-column: 4;
    }
  }
`

export const SecondaryButton = styled(Button)`
  grid-area: secondary-button;
`

export const DraftsBadgeContainer = styled.div`
  grid-area: badge;
  user-select: none;
  margin-left: auto;
  padding: 0 ${sizes(2)};
  display: flex;
  align-items: center;
  justify-content: end;
  height: 100%;
  transition: background-color ${transitions.timings.sharp} ${transitions.easing};

  ${media.sm} {
    padding: 0 ${sizes(3)};
  }

  :hover {
    background-color: ${cVar('colorCoreNeutral700Lighten')};
  }
`

export const DetailsIconWrapper = styled.span`
  margin-left: ${sizes(2)};
`
