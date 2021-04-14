import { StudioContainer } from '@/components'
import { Text } from '@/shared/components'
import { colors, sizes, media } from '@/shared/theme'
import styled from '@emotion/styled'

export const Header = styled.header`
  max-width: 440px;
  margin-bottom: ${sizes(12)};
`

export const Hero = styled(Text)`
  font-size: 54px;
  word-break: break-word;

  ${media.small} {
    font-size: 72px;
  }
`

export const SubTitle = styled(Text)`
  margin-top: ${sizes(3)};
  color: ${colors.gray[300]};
`

export const Wrapper = styled(StudioContainer)`
  display: flex;
  margin-top: 64px;
  justify-content: space-between;
  flex-wrap: wrap;
`

export const MemberChannelGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  ${media.medium} {
    max-width: 600px;
  }
`
