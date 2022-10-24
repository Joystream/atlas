import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { AvatarGroup } from '@/components/Avatar/AvatarGroup'
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

export const StyledAvatarGroup = styled(AvatarGroup)`
  margin-left: ${sizes(4)};
`

export const StudioTopbarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: ${sizes(3)};
`
