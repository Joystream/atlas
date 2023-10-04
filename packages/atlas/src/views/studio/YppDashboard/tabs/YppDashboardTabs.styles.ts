import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgActionArrowRight, SvgAlertsInformative24, SvgAlertsWarning32 } from '@/assets/icons'
import { ActionBar } from '@/components/ActionBar'
import { Banner } from '@/components/Banner'
import { CopyButton } from '@/components/CopyButton/CopyButton'
import { Button } from '@/components/_buttons/Button'
import { cVar, media, sizes, square, zIndex } from '@/styles'

export { Divider } from '../YppDashboard.styles'

export const StyledSvgAlertsInformative24 = styled(SvgAlertsInformative24)`
  path {
    fill: ${cVar('colorTextStrong')};
  }
`

export const SettingsInputsWrapper = styled.div`
  display: grid;
  gap: ${sizes(8)};
  width: 100%;
  max-width: 640px;
  margin: ${sizes(14)} auto;
`

export const StyledSvgActionArrowRight = styled(SvgActionArrowRight)`
  height: 11px;
`

export const StyledSvgAlertsWarning32 = styled(SvgAlertsWarning32)`
  margin-bottom: ${sizes(6)};

  > * {
    fill: ${cVar('colorTextError')};
  }
`

export const StyledBanner = styled(Banner)`
  margin-bottom: ${sizes(6)};
`

export const StyledActionBar = styled(ActionBar)`
  position: fixed;
  left: var(--size-sidenav-width-collapsed);
  right: 0;
  bottom: 0;
  z-index: ${zIndex.sideNav - 1};
`

export const FallbackContainer = styled.div`
  margin-top: 128px;
`
const dotPulse = ({ isOn }: { isOn: boolean }) => keyframes`
  0% {
    box-shadow: none;
  }
  
  10% {
    box-shadow: 0 0 0 3px ${isOn ? '#0c984680' : '#ff695f80'};
  }
  
  20%, 100% {
    box-shadow: none;
  }
  
  
`
export const YppSyncStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${sizes(2)};
  background-color: ${cVar('colorCoreNeutral800Lighten')};
  padding: ${sizes(2.5)} ${sizes(4)};
  border-radius: 99px;
  width: 100%;

  ${media.sm} {
    width: fit-content;
  }

  p {
    white-space: nowrap;
  }
`
export const StatusDotWrapper = styled.div`
  ${square(20)};

  display: grid;
  place-items: center;
`
export const StatusDot = styled.div<{ isOn: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(props) => (props.isOn ? 'linear-gradient(#0ebe57, #096c34)' : 'linear-gradient(#ff695f, #bf0c00)')};
  box-shadow: 0 0 0 5px ${(props) => (props.isOn ? '#0c984680' : '#ff695f80')};
  animation: 10s ease-out ${(props) => dotPulse(props)} infinite;
`

export const StyledCloseButton = styled(Button)`
  position: static;

  ${media.sm} {
    position: absolute;
    top: ${sizes(6)};
    right: ${sizes(6)};
  }

  ${media.lg} {
    position: static;
  }
`

export const StyledCopyButton = styled(CopyButton)`
  width: 100%;

  ${media.sm} {
    width: auto;
  }
`
