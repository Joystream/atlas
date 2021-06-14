import styled from '@emotion/styled'
import { fluidRange } from 'polished'

import { ChannelLink } from '@/components'
import { CONTENT_OVERLAP_MAP, Placeholder, Text } from '@/shared/components'
import { sizes, colors, typography, media } from '@/shared/theme'

export const Header = styled.section`
  position: relative;
  padding-bottom: 50px;

  ${media.medium} {
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

  ${media.small} {
    margin-top: -100px;
    flex-direction: row;
    align-items: center;
  }

  ${media.medium} {
    position: absolute;
    margin-top: 0;
    bottom: ${CONTENT_OVERLAP_MAP.MEDIUM + INFO_BOTTOM_MARGIN}px;
  }

  ${media.large} {
    bottom: ${CONTENT_OVERLAP_MAP.LARGE + INFO_BOTTOM_MARGIN}px;
  }

  ${media.xlarge} {
    bottom: ${CONTENT_OVERLAP_MAP.XLARGE + INFO_BOTTOM_MARGIN}px;
  }

  ${media.xxlarge} {
    bottom: ${CONTENT_OVERLAP_MAP.XXLARGE + INFO_BOTTOM_MARGIN}px;
  }
`
export const TitleContainer = styled.div`
  max-width: 100%;
  overflow: hidden;

  ${media.medium} {
    max-width: 60%;
  }

  z-index: 2;
`

export const Title = styled(Text)`
  ${fluidRange({ prop: 'fontSize', fromSize: '32px', toSize: '40px' })}

  line-height: 1;
  padding: ${sizes(1)} ${sizes(2)} ${sizes(2)};
  background-color: ${colors.gray[800]};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 600px;
`

export const SubTitle = styled(Text)`
  ${fluidRange({ prop: 'fontSize', fromSize: '14px', toSize: '18px' })}

  padding: ${sizes(1)} ${sizes(2)};
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
  ${media.small} {
    margin: 0 ${sizes(6)} 0 0;
  }
`

export const TitlePlaceholder = styled(Placeholder)`
  width: 300px;
  height: ${SM_TITLE_HEIGHT};

  ${media.medium} {
    height: ${TITLE_HEIGHT};
  }
`

export const SubTitlePlaceholder = styled(Placeholder)`
  width: 140px;
  margin-top: ${sizes(2)};
  height: ${SM_SUBTITLE_HEIGHT};

  ${media.medium} {
    height: ${SUBTITLE_HEIGHT};
  }
`
export const StyledButtonContainer = styled.div`
  margin-top: ${sizes(2)};
  z-index: 2;
  background-color: ${colors.transparentBlack[54]};

  ${media.small} {
    margin-top: 0;
    margin-left: auto;
    align-self: center;
  }
`
