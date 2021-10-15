import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'

import { Text } from '@/shared/components/Text'
import { SvgGlyphSearchAlt } from '@/shared/icons'
import { media } from '@/shared/theme'
import { animation } from '@/shared/theme/tokens'

import { colors, sizes } from '../../theme'
import { IconButton } from '../IconButton'

export const Input = styled.input`
  width: 100%;
  height: 100%;
  border: unset;
  padding: 14px ${sizes(3)};
  background: none;
  color: ${colors.gray[50]};

  /* override mobile Safari user agent styling */
  border-radius: 0;
  appearance: none;

  ::placeholder {
    color: ${colors.gray[300]};
  }

  &::-webkit-search-cancel-button {
    appearance: none;
  }
`

export const CancelButton = styled(IconButton)`
  position: absolute;
  right: 0;
  border: none;
  margin-right: ${sizes(2)};

  path {
    stroke: ${colors.gray[300]};
  }
`

export const Container = styled.div<{ hasFocus: boolean; hasQuery: boolean }>`
  display: flex;
  align-items: center;
  will-change: background-color;
  top: 0;
  right: 0;
  animation-duration: 0ms;
  animation-delay: 250ms;
  animation-iteration-count: 1;
  width: 39px;
  height: 39px;
  ${({ hasFocus, hasQuery }) => `
    padding-left: ${hasFocus || hasQuery ? sizes(2) : 0};
    position: ${hasFocus ? 'fixed' : 'relative'};
    background-color: ${hasFocus ? colors.gray[800] : 'transparent'};
    margin-left: ${!hasFocus ? 'auto' : 'unset'};
    box-shadow: ${!hasFocus ? `inset 0 0 0 1px ${colors.gray[700]}` : 'unset'};
  `};

  &.searchbar-enter {
    position: relative;

    > div {
      opacity: 0;
    }
  }

  &.searchbar-enter-active {
    background-color: ${colors.gray[800]};
    position: fixed;
    width: 100%;
    height: 64px;
    transition: background-color ${animation.medium.timing} ${animation.medium.easing};

    ${media.md} {
      position: relative;
      height: 48px;
    }
  }

  &.searchbar-enter-done {
    background-color: ${colors.gray[800]};
    position: fixed;
    width: 100%;
    height: 64px;

    ${media.md} {
      position: relative;
      height: 48px;
    }
  }

  &.searchbar-exit {
    background-color: ${colors.gray[800]};
    position: fixed;
    width: 100%;
    height: 64px;

    ${media.md} {
      position: relative;
      height: 48px;
    }
  }

  &.searchbar-exit-active {
    position: fixed;
    width: 100%;
    height: 64px;
    background-color: transparent;
    transition: background-color ${animation.medium.timing} ${animation.medium.easing} 250ms;

    ${media.md} {
      position: relative;
      height: 48px;
      transition: background-color ${animation.medium.timing} ${animation.medium.easing};
    }

    > button {
      display: none;
    }
  }

  &.searchbar-exit-done {
    position: relative;
    width: ${({ hasQuery, hasFocus }) => (!hasFocus && hasQuery ? '100%' : '39px')};
    height: 39px;

    ${media.md} {
      width: 100%;
      height: 48px;
    }
  }

  ${media.md} {
    position: relative;
    max-width: 480px;
    width: 100%;
    margin-left: 0;
    height: 48px;
    padding-left: ${sizes(4)};
  }
`

// TODO: remove override on viewer update
export const StyledSvgOutlineSearch = styled(SvgGlyphSearchAlt, { shouldForwardProp: isPropValid })<{
  highlighted?: boolean
}>`
  flex-shrink: 0;

  circle,
  path {
    fill: ${({ highlighted }) => (highlighted ? colors.gray[50] : colors.gray[300])};
  }
`

export const SearchHelper = styled(Text)`
  padding-right: ${sizes(4)};
  flex-shrink: 0;
  display: none;

  ${media.md} {
    display: block;
  }
`

export const SearchButton = styled(IconButton)`
  padding: 0;
  margin: 0 auto;

  ${media.md} {
    display: none;
  }
`
