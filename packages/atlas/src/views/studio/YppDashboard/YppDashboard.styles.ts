import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Banner } from '@/components/Banner'
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

export const TabsWrapper = styled.div`
  margin-bottom: ${sizes(6)};
`

export const Divider = styled.div<{ withMargin?: boolean }>`
  margin: ${({ withMargin }) => (withMargin ? `${sizes(2)} 0` : '')};
  background-color: ${cVar('colorBackgroundMutedAlpha')};
  height: 1px;
  width: 100%;
`

export const StyledBanner = styled(Banner)`
  margin-bottom: ${sizes(6)};
`
