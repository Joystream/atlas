import { breakpoints, colors, sizes, transitions, typography } from '@/shared/theme'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Button from '../Button'

type PaginationButtonProps = {
  isActive?: boolean
  isHidden?: boolean
}

export const PaginationWrapper = styled.div`
  display: flex;
  max-width: 400px;
  justify-content: space-between;
  @media screen and (min-width: ${breakpoints.small}) {
    max-width: unset;
    justify-content: unset;
  }
`

export const ChevronButton = styled(Button)`
  @media screen and (min-width: ${breakpoints.small}) {
    &:first-of-type {
      margin-right: ${sizes(8)};
    }
    &:last-of-type {
      margin-left: ${sizes(8)};
    }
  }
`

export const ThreeDotsWrapper = styled.div`
  display: none;
  @media screen and (min-width: ${breakpoints.small}) {
    width: ${sizes(12)};
    height: ${sizes(12)};
    color: ${colors.gray[300]};
    font-size: ${typography.sizes.subtitle2};
    justify-content: center;
    align-items: center;
    display: flex;
    cursor: default;
  }
`

const buttonActiveState = css`
  background-color: ${colors.transparentPrimary[6]};
  color: ${colors.gray[50]};
`

export const PaginationButton = styled.button<PaginationButtonProps>`
  /* show only one active button on mobile */
  display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
  border: none;
  cursor: pointer;
  width: ${sizes(12)};
  height: ${sizes(12)};
  color: ${colors.gray[300]};
  font-size: ${typography.sizes.subtitle2};
  justify-content: center;
  align-items: center;

  background: none;
  border-radius: 100%;
  text-decoration: none;
  font-family: ${typography.fonts.headers};
  transition: background-color ${transitions.timings.loading} ${transitions.easing},
    color ${transitions.timings.loading} ${transitions.easing}, opacity 200ms ${transitions.easing};
  :hover,
  :focus {
    background-color: ${colors.transparentPrimary[12]};
    color: ${colors.gray[50]};
  }
  :active {
    ${buttonActiveState}
  }
  ${({ isActive }) => isActive && buttonActiveState}
  @media screen and (min-width: ${breakpoints.small}) {
    display: flex;
  }
`
