import styled from '@emotion/styled'
import { colors, sizes } from '../../theme'
import IconButton from '../IconButton'
import { SvgOutlineSearch } from '@/shared/icons'

export const Input = styled.input`
  width: 100%;
  height: 100%;
  border: unset;
  padding: 14px ${sizes(3)};
  background: none;
  color: ${colors.white};

  // override mobile Safari user agent styling
  border-radius: 0;
  -webkit-appearance: none;

  ::placeholder {
    color: ${colors.gray[300]};
  }
  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
  }
`

export const CancelButton = styled(IconButton)`
  position: absolute;
  right: 0;
  border: none;
  margin-right: ${sizes(2)};
`

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: ${sizes(14)};
  background-color: ${colors.gray[800]};
  padding-left: ${sizes(4)};
  :focus-within {
    outline: 1px solid ${colors.gray[500]};
  }
`

// TODO: remove override on viewer update
export const StyledSvgOutlineSearch = styled(SvgOutlineSearch)`
  circle,
  path {
    stroke: ${colors.gray['300']};
  }
`
