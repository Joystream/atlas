import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { useMediaMatch } from '@/hooks/useMediaMatch'
import { Button } from '@/shared/components/Button'
import { ShortcutIndicator } from '@/shared/components/ShortcutIndicator'
import { SvgGlyphChevronLeft, SvgGlyphClose, SvgGlyphSearch } from '@/shared/icons'

import { SearchBox } from './SearchBox'
import { SearchHelper } from './Searchbar.style'
import { CancelButton, Container, Input, SearchButton, StyledSvgOutlineSearch } from './Searchbar.style'

type SearchbarProps = {
  value: string | null
  onCancel?: () => void
  showCancelButton?: boolean
  controlled?: boolean
  onClick?: () => void
  hasFocus: boolean
  onClose: () => void
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLInputElement>, HTMLInputElement>
export const Searchbar = React.forwardRef<HTMLDivElement, SearchbarProps>(
  (
    {
      placeholder,
      onChange,
      onFocus,
      onCancel,
      value,
      onBlur,
      onSubmit,
      className,
      onClick,
      hasFocus,
      onClose,
      ...htmlProps
    },
    ref
  ) => {
    const mdMatch = useMediaMatch('md')
    const [recentSearch, setRecentSearch] = useState<string | null | undefined>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRecentSearch(null)
      if (onChange) {
        onChange(e)
      }
    }
    const handleCancel = () => {
      setRecentSearch(null)
      if (onCancel) {
        onCancel()
      }
    }

    const onSelectRecentSearch = (title?: string) => {
      setRecentSearch(title)
    }

    const query = recentSearch || value

    return (
      <>
        <Container className={className} hasFocus={hasFocus} hasQuery={!!query} ref={ref}>
          {(mdMatch || hasFocus || !!query) && (
            <>
              {!mdMatch && hasFocus ? (
                <Button onClick={onClose} iconOnly icon={<SvgGlyphChevronLeft />} variant="tertiary" />
              ) : (
                <StyledSvgOutlineSearch highlighted={hasFocus} width={24} height={24} />
              )}
              <Input
                value={query || ''}
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
          {!!query && (
            <CancelButton onClick={handleCancel} variant="tertiary" size="small">
              <SvgGlyphClose />
            </CancelButton>
          )}
          {!query && !hasFocus && (
            <>
              <SearchButton variant="tertiary" onClick={onClick}>
                <SvgGlyphSearch />
              </SearchButton>
              <SearchHelper variant="caption" secondary>
                Press <ShortcutIndicator>/</ShortcutIndicator>
              </SearchHelper>
            </>
          )}
          <CSSTransition in={hasFocus} timeout={200} unmountOnExit mountOnEnter>
            <SearchBox searchQuery={query || ''} onSelectRecentSearch={onSelectRecentSearch} />
          </CSSTransition>
        </Container>
      </>
    )
  }
)

Searchbar.displayName = 'Searchbar'
