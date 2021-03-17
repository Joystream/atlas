import { Text } from '@/shared/components'
import { breakpoints, colors, sizes } from '@/shared/theme'
import styled from '@emotion/styled'

export const Wrapper = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-top: 64px;
  justify-content: space-between;
  flex-wrap: wrap;
`

export const Header = styled.header`
  max-width: 400px;
  margin-bottom: ${sizes(12)};
`

export const Hero = styled(Text)`
  font-size: 72px;
`

export const SubTitle = styled(Text)`
  margin-top: ${sizes(3)};
  color: ${colors.gray[300]};
`

export const MemberChannelGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  @media screen and (min-width: ${breakpoints.medium}) {
    max-width: 600px;
  }
`
