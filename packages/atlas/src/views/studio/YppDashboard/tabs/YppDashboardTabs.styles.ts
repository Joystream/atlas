import styled from '@emotion/styled'

import { SvgActionArrowRight, SvgAlertsInformative24, SvgAlertsWarning32 } from '@/assets/icons'
import { ActionBar } from '@/components/ActionBar'
import { Banner } from '@/components/Banner'
import { cVar, media, sizes, zIndex } from '@/styles'

export { Divider } from '../YppDashboard.styles'

export const RewardsWrapper = styled.div`
  display: grid;
  gap: ${sizes(4)};
  margin-bottom: ${sizes(4)};

  ${media.md} {
    gap: ${sizes(6)};
    margin-bottom: ${sizes(6)};
  }
`

export const WidgetsWrapper = styled.section`
  display: grid;
  gap: ${sizes(4)};
  margin-bottom: ${sizes(4)};

  ${media.sm} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${media.md} {
    margin-bottom: ${sizes(6)};
  }
`

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
