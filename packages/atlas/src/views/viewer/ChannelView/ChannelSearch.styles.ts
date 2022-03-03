import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { IconButton } from '@/components/_buttons/IconButton'
import { TextField } from '@/components/_inputs/TextField'
import { cVar, media, oldColors, sizes, transitions } from '@/styles'

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

export const SearchButton = styled(IconButton)<SearchButttonProps>`
  position: absolute;

  ${media.sm} {
    ${({ isSearching, isOpen }) => isSearching && !isOpen && activeUnderline}
  }
`

type SearchContainerProps = {
  isOpen?: boolean
}

export const SearchContainer = styled.div<SearchContainerProps>`
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
