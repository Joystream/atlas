import { StudioContainer } from '@/components'
import { Text, Button } from '@/shared/components'
import { sizes, media } from '@/shared/theme'

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
  margin-top: ${sizes(16)};
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const MemberChannelGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  ${media.medium} {
    display: grid;
    grid-template-columns: repeat(auto-fit, 256px);
    gap: ${sizes(8)};
    justify-content: center;
    max-width: 600px;
    margin: 0 auto;
  }
`

export const StyledButton = styled(Button)`
  margin-top: ${sizes(8)};
`
