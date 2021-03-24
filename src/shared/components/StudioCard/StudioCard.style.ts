import { Avatar, Text } from '@/shared/components'
import { colors, sizes } from '@/shared/theme'
import styled from '@emotion/styled'

type CardWrapperProps = {
  blank?: boolean
  to?: string
}

export const CardWrapper = styled.div<CardWrapperProps>`
  width: 256px;
  height: 256px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: ${sizes(6)};
  margin-right: ${sizes(4)};
  margin-bottom: ${sizes(4)};
  align-items: center;
  overflow: hidden;
  background-color: ${({ blank }) => (blank ? colors.gray[900] : colors.gray[800])};
  text-decoration: none;
`
export const HandleText = styled(Text)`
  margin-top: ${sizes(6)};
  width: 100%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
export const Follows = styled(Text)`
  color: ${colors.gray[300]};
  margin-top: ${sizes(1)};
`

export const StyledAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
`
export const IconWrapper = styled.div`
  background-color: ${colors.transparentWhite[6]};
  width: 120px;
  height: 120px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: ${sizes(6)};
    height: ${sizes(6)};
    color: ${colors.transparentWhite[32]};
  }
`
