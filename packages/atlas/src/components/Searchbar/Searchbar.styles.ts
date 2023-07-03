import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'

import { SvgControlsSearchAlt } from '@/assets/icons'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { cVar, media, sizes, square } from '@/styles'

export const Input = styled.input`
  width: 100%;
  height: 100%;
  border: unset;
  padding: 14px ${sizes(3)};
  background: none;
  color: ${cVar('colorCoreNeutral50')};

  /* override mobile Safari user agent styling */
  border-radius: 0;
  appearance: none;

  ::placeholder {
    color: ${cVar('colorCoreNeutral300')};
  }

  &::-webkit-search-cancel-button {
    appearance: none;
  }
`

export const CancelButton = styled(Button)`
  position: absolute;
  right: 0;
  border: none;
  margin-right: ${sizes(2)};

  path {
    fill: ${cVar('colorText')};
  }

  &:hover path {
    fill: ${cVar('colorTextStrong')};
  }
`

export const Container = styled.div<{ hasFocus: boolean; hasQuery: boolean }>`
  top: 0;
  right: 0;
  ${({ hasFocus, hasQuery }) => `
    height: ${hasFocus ? '64px' : '39px'};
    width: ${hasQuery || hasFocus ? '100%' : '39px'};
    background-color: ${hasFocus ? cVar('colorCoreNeutral800') : 'transparent'};
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
  position: ${({ hasFocus }) => (hasFocus ? 'absolute' : 'relative')};
  background-color: ${({ hasFocus }) => (hasFocus ? cVar('colorCoreNeutral800') : cVar('colorCoreNeutral900'))};
  box-shadow: ${({ hasFocus }) => (!hasFocus ? `inset 0 0 0 1px ${cVar('colorCoreNeutral700')}` : 'unset')};
  padding-left: ${({ hasFocus, hasQuery }) => (hasFocus || hasQuery ? sizes(2) : 0)};

  ${media.md} {
    padding-left: ${sizes(4)};
  }
`

export const StyledButton = styled(Button)`
  width: 100% !important;
  height: 100% !important;
  border-radius: unset !important;
`

export const StyledSvgOutlineSearch = styled(SvgControlsSearchAlt, { shouldForwardProp: isPropValid })<{
  highlighted?: boolean
}>`
  flex-shrink: 0;

  circle,
  path {
    fill: ${({ highlighted }) => (highlighted ? cVar('colorCoreNeutral50') : cVar('colorCoreNeutral300'))};
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

export const SearchButton = styled(Button)`
  padding: 0;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  border-radius: unset;

  ${media.md} {
    display: none;
  }
`

export const StyledForm = styled.form`
  display: block;
  width: 100%;
`
