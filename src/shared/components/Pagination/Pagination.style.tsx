import { colors, sizes, transitions, typography } from '@/shared/theme'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

type PaginationButtonProps = {
  isChevron?: boolean
  isActive?: boolean
}

export const PaginationWrapper = styled.div`
  display: flex;
`

const buttonActiveState = css`
  color: ${colors.white};
  background-color: ${colors.gray[800]};
`

export const PaginationButton = styled.button<PaginationButtonProps>`
  border: none;
  cursor: pointer;
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
  ${({ isChevron, isActive }) => !isChevron && isActive && buttonActiveState}
`
