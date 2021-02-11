import { colors, sizes, transitions, typography } from '@/shared/theme'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React from 'react'
import { NavLink, NavLinkProps } from 'react-router-dom'

type StyledLinkProps = {
  isChevron?: boolean
} & NavLinkProps

export const PaginationWrapper = styled.div`
  display: flex;
`

const linkActiveState = css`
  &.active {
    color: ${colors.white};
    background-color: ${colors.gray[800]};
  }
`

// Has to be that way, otherwise a warning is showing up: 'React does not recognize the `isChevron` prop on a DOM element...'
export const StyledLink = styled(({ isChevron, ...rest }: StyledLinkProps) => <NavLink {...rest} />)`
  width: ${sizes(12)};
  height: ${sizes(12)};
  color: ${colors.gray[300]};
  font-size: ${typography.sizes.subtitle2};

  display: flex;
  justify-content: center;
  align-items: center;

  background: none;
  text-decoration: none;
  font-family: ${typography.fonts.headers};
  transition: all ${transitions.timings.loading} ${transitions.easing};
  :hover {
    color: ${colors.white};
    background-color: ${colors.gray[600]};
  }
  ${({ isChevron }) => !isChevron && linkActiveState}
`
