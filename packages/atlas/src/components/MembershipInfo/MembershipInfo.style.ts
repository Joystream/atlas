import styled from '@emotion/styled'

import { media, sizes } from '@/styles'

import { Text } from '../Text'

export const MembershipHeader = styled.header`
  display: grid;
  grid-auto-flow: row;
  gap: ${sizes(6)};
  align-items: center;
  ${media.sm} {
    grid-auto-flow: column;
    justify-content: space-between;
  }

  margin: ${sizes(8)} 0;
`

export const MembershipInfoContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(2, auto);
  justify-items: center;
  gap: ${sizes(6)};
  ${media.sm} {
    gap: ${sizes(8)};
    grid-template-columns: repeat(2, auto);
    grid-template-rows: unset;
    display: inline-grid;
  }
`
export const MembershipDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${media.sm} {
    align-items: unset;
  }

  overflow: hidden;
  max-width: 100%;
`
export const StyledHandle = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`
