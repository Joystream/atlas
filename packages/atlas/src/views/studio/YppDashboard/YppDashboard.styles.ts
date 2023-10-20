import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { breakpoints, media, sizes } from '@/styles'

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

export const HeaderContentBox = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: ${sizes(6)};

  ${media.sm} {
    gap: ${sizes(8)};
    flex-direction: row;
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
  display: grid;
  gap: ${sizes(6)};
  margin-bottom: ${sizes(6)};

  @media (hover: hover) and (min-width: ${breakpoints.sm}) {
    grid-template-columns: 1fr auto;
  }
`
