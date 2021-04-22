import { StudioContainer } from '@/components'
import { Button, Text, Avatar } from '@/shared/components'
import { sizes, colors, transitions } from '@/shared/theme'
import styled from '@emotion/styled'

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
  margin: ${sizes(16)} auto;
  max-width: 600px;
  text-align: center;
`

export const MemberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 272px);
  gap: ${sizes(8)};
  justify-content: center;
`

export const StyledButton = styled(Button)`
  margin-top: ${sizes(8)};
`

export const CardWrapper = styled.div`
  padding: ${sizes(8)};
  width: 272px;
  height: 272px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: ${colors.gray[900]};
  text-decoration: none;
  transition: background-color ${transitions.timings.routing} ${transitions.easing};
  :hover {
    background-color: ${colors.gray[800]};
  }
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
  width: 104px;
  height: 104px;
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
