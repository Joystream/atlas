import styled from '@emotion/styled'
import { colors, sizes, typography, breakpoints, transitions } from '@/shared/theme'
import { Text, Tooltip } from '@/shared/components'
import { StudioContainer } from '@/components'

type ActionBarContainerProps = {
  isActive?: boolean
}

export const StyledActionBarContainer = styled.div<ActionBarContainerProps>`
  display: flex;
  position: fixed;
  bottom: 0;
  left: var(--sidenav-collapsed-width);
  right: 0;
  background-color: ${colors.gray[900]};
  padding: ${sizes(3)} ${sizes(4)};
  @media screen and (min-width: ${breakpoints.medium}) {
    flex-direction: row;
    justify-content: space-between;
    padding: ${sizes(4)} ${sizes(8)};
  }

  transform: translateY(${({ isActive }) => (isActive ? '0' : '100%')});
  transition: transform ${transitions.timings.regular} ${transitions.easing};
`

export const StyledInnerContainer = styled(StudioContainer)`
  display: flex;
  width: 100%;
`

export const StyledInfoContainer = styled.div`
  display: none;
  width: 100%;
  flex-direction: row;
  align-items: flex-start;
  padding-bottom: 0;
  @media screen and (min-width: ${breakpoints.medium}) {
    display: flex;
  }
  @media screen and (min-width: ${breakpoints.large}) {
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
  padding-bottom: ${sizes(2)};
  @media screen and (min-width: ${breakpoints.medium}) {
    margin-right: ${sizes(4)};
  }
`

export const StyledSecondaryText = styled(Text)`
  color: ${colors.gray[300]};
  font-size: ${typography.sizes.body2};
  line-height: 20px;
  max-width: 280px;
  text-align: right;
  align-self: center;
  @media screen and (min-width: ${breakpoints.medium}) {
    text-align: left;
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

export const StyledTooltip = styled(Tooltip)`
  display: none;
  margin-right: ${sizes(14)};
  div {
    display: flex;
    height: 100%;
    align-items: center;
  }
  @media screen and (min-width: ${breakpoints.small}) {
    display: block;
  }
`

export const StyledDetailsTextContainer = styled.div`
  color: ${colors.gray[200]};
  font-size: ${typography.sizes.body2};
  margin-left: auto;
  svg {
    margin-left: ${sizes(2)};
    width: 16px;
    height: 16px;
  }
`
