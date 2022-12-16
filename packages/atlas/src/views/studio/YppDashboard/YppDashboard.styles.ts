import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgAlertsInformative24 } from '@/assets/icons'
import { cVar, media, sizes } from '@/styles'

export const Header = styled.header`
  display: grid;
  gap: ${sizes(6)};
  margin: ${sizes(12)} 0;

  ${media.sm} {
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: ${sizes(12)};
  }
`

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

const commonGridStyles = css`
  display: grid;
  align-items: center;
`

export const TierWrapper = styled.div`
  gap: ${sizes(4)};
  grid-template-columns: auto 1fr;
  ${commonGridStyles}

  ${media.sm} {
    grid-template-columns: repeat(2, auto);
  }
`

export const TierDescription = styled.div`
  gap: ${sizes(2)};
  grid-template-columns: auto 1fr;
  text-align: right;
  justify-items: left;
  ${commonGridStyles}

  ${media.sm} {
    grid-template-columns: repeat(2, auto);
  }
`

export const TierCount = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: ${sizes(1)};
  justify-content: flex-end;
`

export const StyledSvgAlertsInformative24 = styled(SvgAlertsInformative24)`
  path {
    fill: ${cVar('colorTextStrong')};
  }
`

export const SuspendedInfoWrapper = styled.div`
  width: 100%;
  padding: ${sizes(6)};
  border: 1px solid ${cVar('colorCoreNeutral600')};
  margin-bottom: ${sizes(6)};
`

export const SuspendedTitle = styled.div`
  display: grid;
  grid-template-columns: 24px auto;
  column-gap: 10px;
  padding-bottom: ${sizes(2)};
`
