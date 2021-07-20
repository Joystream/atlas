import styled from '@emotion/styled'
import { fluidRange } from 'polished'

import { ChannelLink } from '@/components'
import { Button, Placeholder, Text } from '@/shared/components'
import { colors, media, sizes, typography } from '@/shared/theme'

const SM_TITLE_HEIGHT = '44px'
const TITLE_HEIGHT = '51px'
const SM_SUBTITLE_HEIGHT = '24px'
const SUBTITLE_HEIGHT = '27px'

export const TitleSection = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-row-gap: ${sizes(4)};
  align-items: center;
  width: 100%;
  margin: ${sizes(8)} 0 ${sizes(14)} 0;

  ${media.compact} {
    grid-template-columns: auto 1fr auto;
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
  ${fluidRange({ prop: 'fontSize', fromSize: '24px', toSize: '40px' })};

  line-height: 1;
  margin-bottom: 0;
  padding: ${sizes(1)} ${sizes(2)} ${0};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 600px;
`

export const SortContainer = styled.div`
  display: none;
  grid-gap: 8px;
  grid-template-columns: auto 1fr;
  align-items: center;
  ${media.medium} {
    display: grid;
  }
`

export const SubTitle = styled(Text)`
  ${fluidRange({ prop: 'fontSize', fromSize: '14px', toSize: '18px' })};

  padding: ${sizes(1)} ${sizes(2)};
  margin-top: ${sizes(1)};
  color: ${colors.gray[300]};
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
  grid-column: 1 / span 2;
  width: 100%;

  ${media.compact} {
    grid-column: initial;
    margin-top: 0;
    margin-left: auto;
    align-self: center;
  }
`

export const StyledButton = styled(Button)`
  width: 100%;
`

export const PaginationContainer = styled.div`
  padding-top: ${sizes(6)};
  padding-bottom: ${sizes(16)};
  display: flex;
  align-items: center;
  justify-content: center;
`

export const TabsContainer = styled.div`
  margin-bottom: ${sizes(8)};
  border-bottom: solid 1px ${colors.gray[800]};

  ${media.compact} {
    padding-top: ${sizes(8)};
  }

  ${media.medium} {
    display: grid;
    grid-template-columns: 1fr 250px;
  }
`
