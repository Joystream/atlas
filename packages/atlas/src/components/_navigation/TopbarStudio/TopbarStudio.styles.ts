import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { media, sizes } from '@/styles'

import { TopbarBase } from '../TopbarBase'

const withoutHamburgerButtonStyles = css`
  padding: ${sizes(4)};
  ${media.sm} {
    padding: ${sizes(8)};
  }
`

export const StyledTopbarBase = styled(TopbarBase)<{ withoutHamburgerButton?: boolean }>`
  ${media.sm} {
    display: flex;
    justify-content: space-between;
  }
  ${({ withoutHamburgerButton }) => withoutHamburgerButton && withoutHamburgerButtonStyles};
`

export const StyledAvatar = styled(Avatar)`
  margin-left: ${sizes(4)};
`

export const StudioTopbarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: ${sizes(3)};
`
