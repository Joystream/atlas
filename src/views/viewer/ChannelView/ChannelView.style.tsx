import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { fluidRange } from 'polished'

import { Button } from '@/components/Button'
import { ChannelLink } from '@/components/ChannelLink'
import { IconButton } from '@/components/IconButton'
import { Select } from '@/components/Select'
import { SkeletonLoader } from '@/components/SkeletonLoader'
import { Tabs } from '@/components/Tabs'
import { Text } from '@/components/Text'
import { TextField } from '@/components/TextField'
import { colors, media, sizes, transitions, typography } from '@/theme'

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
    background-color: ${colors.blue[500]};
    bottom: -${sizes(3)};
  }
`

export const TitleSection = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-row-gap: ${sizes(4)};
  align-items: center;
  width: 100%;
  margin: ${sizes(8)} 0 ${sizes(14)} 0;

  ${media.xs} {
    grid-template-columns: auto 1fr auto;
  }
`
export const TitleContainer = styled.div`
  max-width: 100%;
  overflow: hidden;

  ${media.md} {
    max-width: 60%;
  }

  z-index: 2;
`

export const Title = styled(Text)`
  ${fluidRange({ prop: 'fontSize', fromSize: '24px', toSize: '40px' })};

  line-height: 1;
  margin-bottom: 0;
  padding: ${sizes(1)} ${sizes(2)} 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 600px;
`

export const SortContainer = styled.div`
  grid-area: sort;
  display: grid;
  grid-gap: 8px;
  align-items: center;
  grid-template-columns: auto 1fr;

  ${media.sm} {
    grid-template-columns: auto 1fr;
    grid-area: initial;
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
  ${media.sm} {
    margin: 0 ${sizes(6)} 0 0;
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
  margin-top: ${sizes(2)};
  z-index: 2;
  background-color: ${colors.transparentBlack[54]};
  grid-column: 1 / span 2;
  width: 100%;

  ${media.xs} {
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
`

export const TabsContainer = styled.div`
  display: grid;
  margin-bottom: ${sizes(8)};
  gap: ${sizes(2)};
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    'tabs tabs tabs'
    'search search search'
    'sort sort sort';
  grid-template-rows: 1fr auto auto;
  align-items: baseline;
  ${media.xs} {
    padding-top: ${sizes(8)};
  }
  ${media.sm} {
    align-items: center;
    border-bottom: solid 1px ${colors.gray[800]};
    grid-template-areas: initial;
    gap: ${sizes(8)};
    grid-template-rows: 1fr;
    grid-template-columns: auto 1fr 250px;
  }
`

type SearchContainerProps = {
  isOpen?: boolean
}
export const SearchContainer = styled.div<SearchContainerProps>`
  display: flex;
  grid-area: search;
  align-items: center;
  margin: ${sizes(6)} 0 ${sizes(16)};
  position: relative;
  ${media.sm} {
    grid-area: initial;
    margin: 0;
    max-width: 200px;
  }
`

export const StyledTabs = styled(Tabs)`
  grid-area: tabs;
  border-bottom: solid 1px ${colors.gray[800]};
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

  > input {
    height: 40px;
    padding: 10px 16px 10px 42px;
    caret-color: ${colors.blue[500]};
    font-size: ${typography.sizes.body2};
    line-height: ${typography.lineHeights.body2};

    ${media.sm} {
      ${({ isOpen }) => isOpen === false && 'border: none !important'};
    }

    &:focus {
      border: 1px solid ${colors.white};
    }

    ::-webkit-search-cancel-button {
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

export const StyledSelect = styled(Select)`
  button {
    font-size: ${typography.sizes.body2};
    line-height: ${typography.lineHeights.body2};
  }
`
