import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { Button } from '@/components/_buttons/Button'
import { colors, media, sizes, transitions, zIndex } from '@/theme'

export const ActionBarContainer = styled.div<{ isActive?: boolean }>`
  background-color: ${colors.gray[900]};
  border-top: 1px solid ${colors.gray[700]};
  display: grid;
  padding: ${sizes(4)};
  grid-template-rows: auto auto;
  grid-template-columns: 1fr;
  z-index: ${zIndex.header};
  transform: translateY(${({ isActive }) => (isActive ? '0' : '100%')});
  transition: transform ${transitions.timings.regular} ${transitions.easing};
  grid-template-areas: 'primary-text badge' 'primary-button primary-button';

  &.${transitions.names.fade}-enter-active {
    transition: opacity ${transitions.timings.loading} ${transitions.easing} 800ms !important;
  }
  ${media.sm} {
    grid-template-areas: 'primary-text badge primary-button';
    padding: ${sizes(4)} ${sizes(8)};
  }
  ${media.lg} {
    grid-template-columns: max-content 1fr max-content max-content;
    grid-template-areas: 'primary-text secondary-text badge primary-button';
    padding: ${sizes(4)} ${sizes(8)};
  }
`

export const StyledPrimaryText = styled(Text)`
  grid-area: primary-text;
  margin-right: ${sizes(5)};
  align-self: center;
`

export const StyledSecondaryText = styled(Text)`
  display: none;
  ${media.lg} {
    grid-area: secondary-text;
    max-width: 360px;
    align-self: center;
    display: block;
  }
`

export const ActionButtonPrimaryTooltip = styled(Tooltip)`
  grid-area: primary-button;
`

export const ActionButtonPrimary = styled(Button)`
  grid-area: primary-button;
  width: 100%;
  margin-top: ${sizes(4)};
  ${media.sm} {
    margin-top: 0;
    margin-left: ${sizes(4)};
  }
`

export const DraftsBadgeContainer = styled.div`
  grid-area: badge;
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
