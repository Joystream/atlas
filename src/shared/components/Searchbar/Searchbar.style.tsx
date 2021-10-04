import styled from '@emotion/styled'

import { Text } from '@/shared/components/Text'
import { SvgOutlineSearch } from '@/shared/icons'
import { media } from '@/shared/theme'

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

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid ${colors.gray[700]};

  ${media.sm} {
    height: 48px;
    padding-left: ${sizes(4)};
  }
`

// TODO: remove override on viewer update
export const StyledSvgOutlineSearch = styled(SvgOutlineSearch)`
  flex-shrink: 0;

  circle,
  path {
    stroke: ${colors.gray['300']};
  }
`

export const SearchHelper = styled(Text)`
  padding-right: ${sizes(4)};
  flex-shrink: 0;
  display: none;

  ${media.sm} {
    display: block;
  }
`

export const SearchButton = styled(IconButton)`
  padding: 0;
  margin: 0 auto;

  ${media.sm} {
    display: none;
  }
`
