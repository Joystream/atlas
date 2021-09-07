import styled from '@emotion/styled'

import { colors, media, sizes, transitions, typography } from '@/shared/theme'

import { Text } from '../Text'

export const StyledActionBarContainer = styled.div`
  display: flex;
  background-color: ${colors.gray[900]};
  padding: ${sizes(3)} ${sizes(4)};
  border-top: 1px solid ${colors.gray[700]};

  ${media.md} {
    flex-direction: row;
    justify-content: space-between;
    padding: ${sizes(4)} ${sizes(8)};
  }
`

export const StyledInnerContainer = styled.div`
  display: flex;
  width: 100%;
`

export const StyledInfoContainer = styled.div`
  display: none;
  width: 100%;
  flex-direction: row;
  align-items: center;

  ${media.sm} {
    display: flex;
  }

  ${media.lg} {
    align-items: center;
    width: 100%;
  }
`

export const StyledPrimaryText = styled(Text)`
  color: ${colors.white};
  font-family: ${typography.fonts.headers};
  font-size: ${typography.sizes.h5};
  font-weight: ${typography.weights.bold};
  text-align: right;

  ${media.md} {
    margin-right: ${sizes(4)};
  }
`

export const StyledSecondaryText = styled(Text)`
  color: ${colors.gray[300]};
  font-size: ${typography.sizes.body2};
  line-height: 20px;
  max-width: 360px;
  display: none;

  ${media.md} {
    display: block;
  }
`

export const StyledButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  > *:not(:last-child) {
    margin-right: ${sizes(4)};
  }
`

export const DetailsContainer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  padding: 13px ${sizes(4)};
  transition: background-color ${transitions.timings.sharp} ${transitions.easing};

  :hover {
    background-color: ${colors.transparentPrimary[18]};
  }
`

export const DetailsIconWrapper = styled.span`
  margin-left: ${sizes(2)};
`
