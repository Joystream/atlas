import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'

import { Text } from '@/shared/components/Text'
import { SvgGlyphSearchAlt } from '@/shared/icons'
import { media, transitions } from '@/shared/theme'

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
  transition: width ${transitions.timings.regular} ${transitions.easing};
  will-change: width;
  top: 0;
  right: 0;
  box-shadow: inset 0 0 0 1px ${colors.gray[700]};
  ${({ hasFocus, hasQuery }) => `
    height: ${hasFocus ? '64px' : '39px'};
    position: ${hasFocus ? 'fixed' : 'relative'};
    width: ${hasQuery || hasFocus ? '100%' : '39px'};
    padding-left: ${hasFocus || hasQuery ? sizes(2) : 0};
    background-color: ${hasFocus ? colors.gray[800] : 'transparent'};
    ${
      !hasFocus &&
      `
      border: 1px solid ${colors.gray[700]};
      margin-left: auto;`
    };
  `};

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
