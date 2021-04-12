import { StudioContainer } from '@/components'
import { Button, Text, Avatar } from '@/shared/components'
import { sizes, colors } from '@/shared/theme'
import styled from '@emotion/styled'
import isPropValid from '@emotion/is-prop-valid'

export const Header = styled.header`
  margin: 0 auto;
  text-align: center;
  max-width: 400px;
  margin-bottom: ${sizes(12)};
`

export const Hero = styled(Text)`
  word-break: break-word;
`

export const SubTitle = styled(Text)`
  margin-top: ${sizes(6)};
`

export const Wrapper = styled(StudioContainer)`
  margin-top: ${sizes(16)};
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const MemberChannelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 256px);
  gap: ${sizes(8)};
  justify-content: center;
  max-width: 600px;
  margin: 0 auto;
`

export const StyledButton = styled(Button)`
  margin-top: ${sizes(8)};
`

type CardWrapperProps = {
  empty?: boolean
  to?: string
}
export const CardWrapper = styled('div', { shouldForwardProp: isPropValid })<CardWrapperProps>`
  width: 256px;
  height: 256px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: ${sizes(6)};
  align-items: center;
  overflow: hidden;
  background-color: ${({ empty }) => (empty ? colors.gray[900] : colors.gray[800])};
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
`
