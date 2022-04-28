import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { Button } from '@/components/_buttons/Button'
import { cVar, media, sizes, transitions, zIndex } from '@/styles'

export type ActionBarVariant = 'new' | 'edit' | 'nft'

type ActionBarContainerProps = {
  isActive?: boolean
  variant: ActionBarVariant
}

const getGridTemplate = ({ variant }: ActionBarContainerProps) => {
  switch (variant) {
    case 'new':
      return css`
        grid-template: 'primary-text badge' auto 'primary-button primary-button' auto / 1fr;
        ${media.sm} {
          grid-template-areas: 'primary-text badge primary-button';
        }
        ${media.lg} {
          grid-template-columns: max-content 1fr max-content max-content;
          grid-template-areas: 'primary-text secondary-text badge primary-button';
        }
      `
    case 'edit':
      return css`
        grid-template: 'primary-text secondary-button' auto 'primary-button primary-button' auto / 1fr;
        ${media.sm} {
          grid-template-areas: 'primary-text secondary-button primary-button';
        }
        ${media.lg} {
          grid-template-columns: max-content 1fr max-content max-content;
          grid-template-areas: 'primary-text secondary-text secondary-button primary-button';
        }
      `
    case 'nft':
      return css`
        display: block;
        ${media.sm} {
          display: grid;
          grid-template-areas: 'primary-text badge secondary-button primary-button';
          grid-template-columns: 1fr max-content max-content max-content;
        }
        ${media.lg} {
          grid-template-columns: max-content 1fr max-content max-content max-content;
          grid-template-areas: 'primary-text secondary-text badge secondary-button primary-button';
        }
      `
  }
}

export const ActionBarContainer = styled.div<ActionBarContainerProps>`
  background-color: ${cVar('colorBackground')};
  box-shadow: ${cVar('effectDividersTop')};
  display: grid;
  padding: ${sizes(4)};
  z-index: ${zIndex.transactionBar};
  transform: translateY(${({ isActive }) => (isActive ? '0' : '100%')});
  transition: transform ${transitions.timings.regular} ${transitions.easing};

  &.${transitions.names.fade}-enter-active {
    transition: opacity ${transitions.timings.loading} ${transitions.easing} 800ms !important;
  }
  ${media.sm} {
    padding: ${sizes(4)} ${sizes(8)};
  }
  ${media.lg} {
    padding: ${sizes(4)} ${sizes(8)};
  }

  ${getGridTemplate}
`

export const NFTTopWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 32px;
`
export const NFTBottomWrapper = styled.div`
  display: flex;
`

export const StyledPrimaryText = styled(Text)`
  grid-area: primary-text;
  margin-right: ${sizes(5)};
  align-self: center;
  padding: 6px 0;
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

export const EditSecondaryButton = styled(Button)`
  grid-area: secondary-button;
  flex-shrink: 0;
`
export const SecondaryButton = styled(Button)`
  flex-shrink: 0;
  grid-area: secondary-button;
  margin-top: ${sizes(4)};
  margin-right: ${sizes(4)};
  ${media.sm} {
    margin-right: 0;
    margin-top: 0;
    margin-left: ${sizes(4)};
  }
`

export const DraftsBadgeContainer = styled.div`
  grid-area: badge;
  user-select: none;
  margin-left: auto;
  padding: 0 ${sizes(3)};
  display: flex;
  align-items: center;
  height: 100%;
  transition: background-color ${transitions.timings.sharp} ${transitions.easing};

  ${media.sm} {
    padding: 0 ${sizes(4)};
  }

  :hover {
    background-color: ${cVar('colorCoreNeutral700Lighten')};
  }
`

export const DetailsIconWrapper = styled.span`
  margin-left: ${sizes(2)};
`
