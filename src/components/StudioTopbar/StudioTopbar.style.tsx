import styled from '@emotion/styled'
import { breakpoints, colors, sizes, transitions, typography, zIndex } from '@/shared/theme'
import { TopbarBase, Avatar, Text } from '@/shared/components'

export const StyledTopbarBase = styled(TopbarBase)`
  display: flex;
  justify-content: space-between;
  @media screen and (min-width: ${breakpoints.small}) {
    display: flex;
    justify-content: space-between;
  }
`

export const StudioContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: ${sizes(3)};
`

export const MemberInfoContainer = styled.div`
  display: flex;
`

export const StyledAvatar = styled(Avatar)`
  width: 42px;
  height: 42px;
  margin-left: 20px;
  margin-right: 10px;
`

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  p:nth-of-type(1) {
    font-size: ${typography.sizes.body1};
    color: ${colors.white};
  }
  p:nth-of-type(2) {
    font-size: ${typography.sizes.caption};
    color: ${colors.gray[100]};
    opacity: 0.4;
  }
`

export const NavDrawerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px;
  transform: translateY(60px);
  width: 320px;
  background-color: ${colors.gray[800]};
  ${MemberInfoContainer} {
    &:hover {
      background-color: white;
    }
  }
`
