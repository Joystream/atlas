import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { IconButton } from '@/components/_buttons/IconButton'
import { SvgControlsSearchAlt } from '@/components/_icons'
import { cVar } from '@/styles'
import { media, oldColors, sizes, square } from '@/styles'

export const Input = styled.input`
  width: 100%;
  height: 100%;
  border: unset;
  padding: 14px ${sizes(3)};
  background: none;
  color: ${oldColors.gray[50]};

  /* override mobile Safari user agent styling */
  border-radius: 0;
  appearance: none;

  ::placeholder {
    color: ${oldColors.gray[300]};
  }

  &::-webkit-search-cancel-button {
    appearance: none;
  }
`

export const CancelButton = styled(IconButton)`
  position: absolute;
  right: ${sizes(4)};
  border: none;
  margin-right: ${sizes(2)};

  path {
    stroke: ${oldColors.gray[300]};
  }

  ${media.md} {
    right: 0;
  }
`

export const Container = styled.div<{ hasFocus: boolean; hasQuery: boolean }>`
  top: 0;
  right: 0;
  ${({ hasFocus, hasQuery }) => `
    height: ${hasFocus ? '64px' : '39px'};
    width: ${hasQuery || hasFocus ? '100%' : '39px'};
    background-color: ${hasFocus ? oldColors.gray[800] : 'transparent'};
    margin-left: ${!hasFocus ? 'auto' : 'unset'};
  `};

  ${media.md} {
    position: relative;
    max-width: 480px;
    width: 100%;
    margin-left: 0;
    height: 48px;
  }
`

export const InnerContainer = styled.div<{ hasFocus: boolean; hasQuery: boolean }>`
  ${square('100%')};

  display: flex;
  align-items: center;
  transition: background-color ${cVar('animationTransitionMedium')};
  will-change: background-color;
  top: 0;
  left: 0;
  position: ${({ hasFocus }) => (hasFocus ? 'absolute' : 'unset')};
  background-color: ${({ hasFocus }) => (hasFocus ? oldColors.gray[800] : oldColors.gray[900])};
  box-shadow: ${({ hasFocus }) => (!hasFocus ? `inset 0 0 0 1px ${oldColors.gray[700]}` : 'unset')};
  padding-left: ${({ hasFocus, hasQuery }) => (hasFocus || hasQuery ? sizes(2) : 0)};

  ${media.md} {
    position: relative;
    padding-left: ${sizes(4)};
  }
`

export const StyledSvgOutlineSearch = styled(SvgControlsSearchAlt, { shouldForwardProp: isPropValid })<{
  highlighted?: boolean
}>`
  flex-shrink: 0;

  circle,
  path {
    fill: ${({ highlighted }) => (highlighted ? oldColors.gray[50] : oldColors.gray[300])};
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

export const StyledForm = styled.form`
  display: block;
  width: 100%;
`
