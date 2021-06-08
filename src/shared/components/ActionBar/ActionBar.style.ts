import styled from '@emotion/styled'

import { Text } from '@/shared/components'
import { colors, sizes, typography, media } from '@/shared/theme'

export const StyledActionBarContainer = styled.div`
  display: flex;
  background-color: ${colors.gray[900]};
  padding: ${sizes(3)} ${sizes(4)};
  border-top: 1px solid ${colors.gray[700]};

  ${media.medium} {
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

  ${media.small} {
    display: flex;
  }

  ${media.large} {
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

  ${media.medium} {
    margin-right: ${sizes(4)};
  }
`

export const StyledSecondaryText = styled(Text)`
  color: ${colors.gray[300]};
  font-size: ${typography.sizes.body2};
  line-height: 20px;
  max-width: 360px;
  display: none;

  ${media.medium} {
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
  padding: 0 ${sizes(5)};
`

export const DetailsIconWrapper = styled.span`
  margin-left: ${sizes(2)};
`
