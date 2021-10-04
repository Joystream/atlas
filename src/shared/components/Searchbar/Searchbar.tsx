import React, { useState } from 'react'

import { useMediaMatch } from '@/hooks/useMediaMatch'
import { SvgGlyphClose, SvgGlyphSearch } from '@/shared/icons'

import { CancelButton, Container, Input, SearchButton, StyledSvgOutlineSearch } from './Searchbar.style'

type SearchbarProps = {
  value: string
  onCancel?: () => void
  showCancelButton?: boolean
  controlled?: boolean
  onClick?: () => void
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLInputElement>, HTMLInputElement>
export const Searchbar: React.FC<SearchbarProps> = ({
  placeholder,
  onChange,
  onFocus,
  onCancel,
  showCancelButton = false,
  controlled = false,
  value: externalValue,
  onBlur,
  onSubmit,
  className,
  onClick,
  ...htmlProps
}) => {
  const [value, setValue] = useState('')
  const smMatch = useMediaMatch('sm')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e)
    }
    if (!controlled) {
      setValue(e.currentTarget.value)
    }
  }
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    if (!controlled) {
      setValue('')
    }
  }

  return (
    <Container className={className}>
      {(smMatch || showCancelButton) && (
        <>
          <StyledSvgOutlineSearch />
          <Input
            value={controlled ? externalValue : value}
            placeholder={placeholder}
            type="search"
            onChange={handleChange}
            onFocus={onFocus}
            onFocusCapture={onFocus}
            onBlur={onBlur}
            onSubmit={onSubmit}
            data-hj-allow
            {...htmlProps}
          />
        </>
      )}
      {showCancelButton ? (
        <CancelButton onClick={handleCancel} variant="tertiary" size="small">
          <SvgGlyphClose />
        </CancelButton>
      ) : (
        <>
          <SearchButton variant="tertiary" onClick={onClick}>
            <SvgGlyphSearch />
          </SearchButton>
          {/**
             * This was done in advance as part of the search sprint and will be implemented in the new search flow.
               <SearchHelper variant="caption" secondary>
                 Press <ShortcutIndicator>/</ShortcutIndicator>
               </SearchHelper>
          */}
        </>
      )}
    </Container>
  )
}
