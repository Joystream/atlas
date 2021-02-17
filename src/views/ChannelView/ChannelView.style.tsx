import { Avatar, Placeholder, Button, Text } from '@/shared/components'
import { breakpoints, sizes, colors } from '@/shared/theme'
import { fluidRange } from 'polished'
import styled from '@emotion/styled'

export const VideoSection = styled.section`
  position: relative;
`

export const Header = styled.section`
  position: relative;
`

const SM_TITLE_HEIGHT = '44px'
const TITLE_HEIGHT = '51px'
const SM_SUBTITLE_HEIGHT = '24px'
const SUBTITLE_HEIGHT = '27px'

export const TitleSection = styled.div`
  position: absolute;
  margin-top: 40px;
  top: 0;
  width: 100%;
  @media (min-width: ${breakpoints.small}) {
    display: flex;
    align-items: center;
  }
`

export const ChannelInfo = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${sizes(5)};
`

export const StyledAvatar = styled(Avatar)`
  margin: 0 ${sizes(6)} 0 0;
  margin-bottom: ${sizes(3)};
  z-index: 2;

  @media (min-width: ${breakpoints.small}) {
    margin: 0 ${sizes(6)} 0 0;
  }
`

export const TitleContainer = styled.div`
  z-index: 2;
  max-width: 100%;
`

export const Title = styled(Text)`
  line-height: 1;
  padding: ${sizes(1)} ${sizes(2)} ${sizes(2)};
  ${fluidRange({ prop: 'fontSize', fromSize: '32px', toSize: '40px' })};
  background-color: ${colors.gray[800]};
  text-overflow: ellipsis;
  max-height: 250px;
  overflow: hidden;
  @media (min-width: ${breakpoints.small}) {
    word-break: break-all;
  }
`

export const SubTitle = styled(Text)`
  padding: ${sizes(1)} ${sizes(2)};
  ${fluidRange({ prop: 'fontSize', fromSize: '14px', toSize: '18px' })};
  margin-top: ${sizes(2)};
  color: ${colors.white};
  background-color: ${colors.gray[800]};
  display: inline-block;
`

export const TitlePlaceholder = styled(Placeholder)`
  width: 300px;
  height: ${SM_TITLE_HEIGHT};
  @media screen and (min-width: ${breakpoints.medium}) {
    height: ${TITLE_HEIGHT};
  }
`

export const SubTitlePlaceholder = styled(Placeholder)`
  width: 140px;
  margin-top: ${sizes(2)};
  height: ${SM_SUBTITLE_HEIGHT};
  @media screen and (min-width: ${breakpoints.medium}) {
    height: ${SUBTITLE_HEIGHT};
  }
`
export const StyledButton = styled(Button)`
  position: relative;
  z-index: 3;
  margin-top: ${sizes(2)};
  @media screen and (min-width: ${breakpoints.small}) {
    margin-top: 0;
    margin-left: auto;
  }
`
