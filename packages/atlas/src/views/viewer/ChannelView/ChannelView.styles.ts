import styled from '@emotion/styled'

import { Tabs } from '@/components/Tabs'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { ChannelLink } from '@/components/_channel/ChannelLink'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, media, oldColors, sizes, transitions } from '@/styles'

const SM_TITLE_HEIGHT = '44px'
const TITLE_HEIGHT = '51px'
const SM_SUBTITLE_HEIGHT = '24px'
const SUBTITLE_HEIGHT = '27px'

export const TitleSection = styled.div`
  margin-top: -${sizes(6)};
  display: grid;
  grid-template-rows: repeat(auto, 3);
  grid-template-columns: 1fr;
  grid-row-gap: ${sizes(6)};
  justify-items: center;
  width: 100%;

  ${media.sm} {
    margin-top: 0;
    grid-template-columns: min-content 1fr auto;
  }
`

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  overflow: hidden;
  z-index: 2;
  justify-self: stretch;
  justify-content: center;

  ${media.sm} {
    align-items: normal;
    margin-left: ${sizes(6)};
  }
`

export const Title = styled(Text)`
  margin-bottom: 0;
`

export const SortContainer = styled.div`
  grid-area: sort;

  ${media.sm} {
    grid-area: initial;
  }
`

export const FilterButtonContainer = styled.div`
  grid-area: filter;
  grid-gap: 8px;

  ${media.sm} {
    grid-area: initial;
  }
`

export const SubTitle = styled(Text)`
  margin: ${sizes(2)} 0;
  color: ${oldColors.gray[300]};
  display: inline-block;
`

export const VideoSection = styled.section`
  position: relative;
`

export const StyledChannelLink = styled(ChannelLink)`
  position: relative;
  border: solid 8px black;
  border-radius: 100%;
  ${media.sm} {
    border: none;
    margin: 0;
  }
`

export const TitleSkeletonLoader = styled(SkeletonLoader)`
  width: 300px;
  height: ${SM_TITLE_HEIGHT};

  ${media.md} {
    height: ${TITLE_HEIGHT};
  }
`

export const SubTitleSkeletonLoader = styled(SkeletonLoader)`
  width: 140px;
  margin-top: ${sizes(2)};
  height: ${SM_SUBTITLE_HEIGHT};

  ${media.md} {
    height: ${SUBTITLE_HEIGHT};
  }
`
export const StyledButtonContainer = styled.div`
  z-index: 2;
  width: 100%;

  ${media.sm} {
    width: auto;
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
`

export const TabsWrapper = styled.div<{ isFiltersOpen: boolean }>`
  z-index: 99;
  position: relative;
  margin-bottom: ${sizes(8)};

  ${media.sm} {
    margin-bottom: ${({ isFiltersOpen }) => sizes(isFiltersOpen ? 30 : 12)};
    transition: margin-bottom ${transitions.timings.routing} ${transitions.easing};
  }
`

export const TabsContainer = styled.div`
  display: grid;
  padding-top: ${sizes(8)};
  gap: ${sizes(4)};
  grid-template: 'tabs tabs tabs' 1fr 'search search search' auto 'sort sort filter' auto / 1fr 1fr;
  background-color: #000;

  ${media.sm} {
    align-items: center;
    box-shadow: ${cVar('effectDividersBottom')};
    gap: ${sizes(4)};
    grid-template: 1fr / auto 1fr 160px 99px;
  }
`

export const StyledTabs = styled(Tabs)`
  grid-area: tabs;
  border-bottom: solid 1px ${oldColors.gray[700]};

  ${media.sm} {
    border-bottom: none;
    grid-area: initial;
  }
`

export const NotFoundChannelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - var(--size-topbar-height));
`

export const CollectorsBoxContainer = styled.div`
  display: flex;
  height: 64px;
  flex-direction: row-reverse;
  margin-top: -${sizes(8)};
`
