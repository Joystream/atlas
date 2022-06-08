import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
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
      ${({ isOpen }) => isOpen === false && 'box-shadow: none !important'};
    }

    :focus {
      box-shadow: 0 0 0 1px ${cVar('colorCoreNeutral50')};
    }

    ::-webkit-search-cancel-button,
    &[type='search'] {
      /* stylelint-disable-next-line property-no-vendor-prefix */
      -webkit-appearance: none;
    }
  }
`

export const SearchButton = styled(Button)`
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
