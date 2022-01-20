import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Tabs } from '@/components/Tabs'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { IconButton } from '@/components/_buttons/IconButton'
import { ChannelLink } from '@/components/_channel/ChannelLink'
import { TextField } from '@/components/_inputs/TextField'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, media, oldColors, sizes, transitions } from '@/styles'

const SM_TITLE_HEIGHT = '44px'
const TITLE_HEIGHT = '51px'
const SM_SUBTITLE_HEIGHT = '24px'
const SUBTITLE_HEIGHT = '27px'

const activeUnderline = css`
  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 4px;
    background-color: ${oldColors.blue[500]};
    bottom: -${sizes(3)};
  }
`

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
    grid-template-columns: min-content max-content auto;
  }
`

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  overflow: hidden;
  z-index: 2;

  ${media.sm} {
    align-items: normal;
    justify-content: center;
  }
`

export const Title = styled(Text)`
  margin-bottom: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 600px;
`

export const SortContainer = styled.div`
  grid-area: sort;
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
    margin: 0 ${sizes(8)} 0 0;
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

export const TabsContainer = styled.div`
  display: grid;
  padding-top: ${sizes(8)};
  margin-bottom: ${sizes(8)};
  gap: ${sizes(2)};
  grid-template: 'tabs tabs tabs' 1fr 'search search search' auto 'sort sort sort' auto / 1fr 1fr;
  align-items: baseline;

  ${media.sm} {
    align-items: center;
    box-shadow: ${cVar('effectDividersBottom')};
    gap: ${sizes(8)};
    grid-template: 1fr / auto 1fr 193.333px;
  }
`

type SearchContainerProps = {
  isOpen?: boolean
}
export const SearchContainer = styled.div<SearchContainerProps>`
  display: flex;
  grid-area: search;
  align-items: center;
  margin: ${sizes(6)} 0 ${sizes(2)} 0;
  position: relative;
  ${media.sm} {
    grid-area: initial;
    margin: 0;
    max-width: 200px;
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

type TextFieldProps = {
  isOpen?: boolean
  isSearching?: boolean
}
export const StyledTextField = styled(TextField)<TextFieldProps>`
  transition: all ${transitions.timings.regular} ${transitions.easing};
  will-change: max-width;
  align-items: center;
  position: relative;

  ${media.sm} {
    max-width: ${({ isOpen }) => (isOpen ? '200px' : '0px')};
  }

  ${({ isSearching }) => isSearching && activeUnderline}

  input {
    height: 40px;
    padding: 10px 16px 10px 42px;
    caret-color: ${oldColors.blue[500]};
    font: ${cVar('typographyDesktopT200')};
    letter-spacing: ${cVar('typographyDesktopT200LetterSpacing')};
    text-transform: ${cVar('typographyDesktopT200TextTransform')};

    ${media.sm} {
      ${({ isOpen }) => isOpen === false && 'border: none !important'};
    }

    :focus {
      border: 1px solid ${oldColors.white};
    }

    ::-webkit-search-cancel-button {
      /* stylelint-disable-next-line property-no-vendor-prefix */
      -webkit-appearance: none;
    }
  }
`

type SearchButttonProps = {
  isSearching?: boolean
  isOpen?: boolean
}
export const NotFoundChannelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - var(--size-topbar-height));
`

export const SearchButton = styled(IconButton)<SearchButttonProps>`
  position: absolute;

  ${media.sm} {
    ${({ isSearching, isOpen }) => isSearching && !isOpen && activeUnderline}
  }
`
export const CollectorsBoxContainer = styled.div`
  display: flex;
  height: 64px;
  flex-direction: row-reverse;
  margin-top: -${sizes(8)};
`
