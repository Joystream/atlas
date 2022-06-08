import styled from '@emotion/styled'

import { IconButton } from '@/components/_buttons/IconButton'
import { Input } from '@/components/_inputs/Input'
import { cVar, media, sizes, transitions } from '@/styles'

type TextFieldProps = {
  isOpen?: boolean
  isSearching?: boolean
}
export const StyledInput = styled(Input)<TextFieldProps>`
  transition: all ${transitions.timings.regular} ${transitions.easing};
  will-change: max-width;
  align-items: center;
  position: relative;

  ${media.sm} {
    max-width: ${({ isOpen }) => (isOpen ? '200px' : '0px')};
  }

  input {
    height: 40px;
    padding: 10px 16px 10px 42px;
    caret-color: ${cVar('colorCoreBlue500')};
    font: ${cVar('typographyDesktopT200')};
    letter-spacing: ${cVar('typographyDesktopT200LetterSpacing')};
    text-transform: ${cVar('typographyDesktopT200TextTransform')};
    border-radius: 0;

    ${media.sm} {
      ${({ isOpen }) => isOpen === false && 'border: none !important'};
    }

    :focus {
      border: 1px solid ${cVar('colorCoreNeutral50')};
    }

    ::-webkit-search-cancel-button,
    &[type='search'] {
      /* stylelint-disable-next-line property-no-vendor-prefix */
      -webkit-appearance: none;
    }
  }
`

export const SearchButton = styled(IconButton)`
  position: absolute;
`

export const SearchContainerForm = styled.form`
  display: flex;
  grid-area: search;
  align-items: center;
  margin: ${sizes(8)} 0 ${sizes(2)} 0;
  position: relative;

  ${media.sm} {
    grid-area: initial;
    margin: 0;
    max-width: 200px;
  }
`
