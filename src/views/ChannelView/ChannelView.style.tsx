import { CONTENT_OVERLAP_MAP, Placeholder, Text } from '@/shared/components'
import { breakpoints, sizes, colors, typography } from '@/shared/theme'
import { fluidRange } from 'polished'
import styled from '@emotion/styled'
import { ChannelLink } from '@/components'

export const Header = styled.section`
  position: relative;
  padding-bottom: 50px;

  @media screen and (min-width: ${breakpoints.medium}) {
    padding-bottom: 0;
  }
`

const SM_TITLE_HEIGHT = '44px'
const TITLE_HEIGHT = '51px'
const SM_SUBTITLE_HEIGHT = '24px'
const SUBTITLE_HEIGHT = '27px'

const INFO_BOTTOM_MARGIN = 75

export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  margin-top: -64px;
  @media screen and (min-width: ${breakpoints.small}) {
    margin-top: -100px;
    flex-direction: row;
    align-items: center;
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    position: absolute;
    margin-top: 0;
    bottom: ${CONTENT_OVERLAP_MAP.MEDIUM + INFO_BOTTOM_MARGIN}px;
  }
  @media screen and (min-width: ${breakpoints.large}) {
    bottom: ${CONTENT_OVERLAP_MAP.LARGE + INFO_BOTTOM_MARGIN}px;
  }
  @media screen and (min-width: ${breakpoints.xlarge}) {
    bottom: ${CONTENT_OVERLAP_MAP.XLARGE + INFO_BOTTOM_MARGIN}px;
  }
  @media screen and (min-width: ${breakpoints.xxlarge}) {
    bottom: ${CONTENT_OVERLAP_MAP.XXLARGE + INFO_BOTTOM_MARGIN}px;
  }
`
export const TitleContainer = styled.div`
  max-width: 100%;
  overflow: hidden;
  @media screen and (min-width: ${breakpoints.medium}) {
    max-width: 60%;
  }
  z-index: 2;
`

export const Title = styled(Text)`
  line-height: 1;
  padding: ${sizes(1)} ${sizes(2)} ${sizes(2)};
  ${fluidRange({ prop: 'fontSize', fromSize: '32px', toSize: '40px' })};
  background-color: ${colors.gray[800]};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 600px;
`

export const SubTitle = styled(Text)`
  padding: ${sizes(1)} ${sizes(2)};
  ${fluidRange({ prop: 'fontSize', fromSize: '14px', toSize: '18px' })};
  margin-top: ${sizes(2)};
  color: ${colors.white};
  background-color: ${colors.gray[800]};
  display: inline-block;
`

export const VideoSection = styled.section`
  position: relative;
`

export const StyledChannelLink = styled(ChannelLink)`
  margin-bottom: ${sizes(3)};
  position: relative;
  span {
    font-size: ${typography.sizes.h2};
  }
  @media (min-width: ${breakpoints.small}) {
    margin: 0 ${sizes(6)} 0 0;
  }
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
export const StyledButtonContainer = styled.div`
  margin-top: ${sizes(2)};
  z-index: 2;
  @media screen and (min-width: ${breakpoints.small}) {
    margin-top: 0;
    padding-left: ${sizes(6)};
    margin-left: auto;
    align-self: center;
  }
`
