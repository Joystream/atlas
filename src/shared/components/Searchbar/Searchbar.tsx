import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { usePersonalDataStore } from '@/providers/personalData'
import { IconButton } from '@/shared/components/IconButton'
import { ShortcutIndicator } from '@/shared/components/ShortcutIndicator'
import { SvgGlyphChevronLeft, SvgGlyphClose, SvgGlyphSearch } from '@/shared/icons'

import { SearchBox } from './SearchBox'
import { SearchHelper } from './Searchbar.style'
import { CancelButton, Container, InnerContainer, Input, SearchButton, StyledSvgOutlineSearch } from './Searchbar.style'

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
      onClick,
      hasFocus,
      onClose,
      onKeyDown,
      ...htmlProps
    },
    ref
  ) => {
    const mdMatch = useMediaMatch('md')
    const [recentSearch, setRecentSearch] = useState<string | null | undefined>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [selectedItem, setSelectedItem] = useState<number | null>(null)
    const [numberOfItems, setNumberOfItems] = useState<number | null>(null)
    const navigate = useNavigate()
    const query = recentSearch || value
    const { addRecentSearch } = usePersonalDataStore((state) => ({
      addRecentSearch: state.actions.addRecentSearch,
    }))

    useEffect(() => {
      if (selectedItem === null || !hasFocus) {
        setRecentSearch(null)
      }
    }, [selectedItem, hasFocus])

    useEffect(() => {
      const onKeyPress = (event: KeyboardEvent) => {
        if (event.key === '/') {
          onClick?.()
          inputRef.current && setTimeout(() => inputRef.current?.focus(), 10)
        }
        if ((event.key === 'Enter' || event.key === 'NumpadEnter') && !!query) {
          inputRef?.current?.blur()
          onClose?.()
        }
      }
      window.addEventListener('keydown', onKeyPress)
      return () => {
        window.removeEventListener('keydown', onKeyPress)
      }
    }, [onClick, onClose, query])

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if ((event.key === 'Enter' || event.key === 'NumpadEnter') && query?.trim() && !selectedItem) {
        addRecentSearch(query)

        // navigate to search results
        navigate(absoluteRoutes.viewer.search({ query: query?.trim() }))
      }
      if (event.key === 'Escape' || event.key === 'Esc' || event.key === 'Tab') {
        event.preventDefault()
        onClose?.()
        event.currentTarget.blur()
        setSelectedItem(null)
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setSelectedItem((prevState) => {
          if (prevState === null) {
            return 0
          }
          return prevState + 1
        })
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setSelectedItem((prevState) => {
          if (prevState === null && numberOfItems) {
            return numberOfItems - 1
          }
          if (prevState === 0) {
            return null
          }
          return prevState ? prevState - 1 : 0
        })
      }
    }

    const onLastSelectedItem = () => {
      setSelectedItem(0)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRecentSearch(null)
      setSelectedItem(null)
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
      onClose()
    }

    const onSelectItem = useCallback((title?: string | null) => {
      setRecentSearch(title)
    }, [])

    const handleSetNumberOfItems = (items: number) => {
      setNumberOfItems(items)
    }

    return (
      <>
        <Container hasFocus={hasFocus} ref={ref} hasQuery={!!query}>
          <InnerContainer hasFocus={hasFocus} hasQuery={!!query}>
            {(mdMatch || hasFocus || !!query) && (
              <>
                {!mdMatch && hasFocus ? (
                  <IconButton onClick={onClose} variant="tertiary">
                    <SvgGlyphChevronLeft />
                  </IconButton>
                ) : (
                  <StyledSvgOutlineSearch highlighted={hasFocus} width={24} height={24} />
                )}
                <Input
                  value={query || ''}
                  placeholder={placeholder}
                  type="search"
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onFocus={onFocus}
                  onFocusCapture={onFocus}
                  onBlur={onBlur}
                  onSubmit={onSubmit}
                  data-hj-allow
                  ref={inputRef}
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
          </InnerContainer>
          <CSSTransition classNames="searchbox" in={hasFocus} unmountOnExit mountOnEnter timeout={600}>
            <SearchBox
              searchQuery={value || ''}
              onSelectRecentSearch={onSelectRecentSearch}
              selectedItem={selectedItem}
              onLastSelectedItem={onLastSelectedItem}
              onSelectItem={onSelectItem}
              handleSetNumberOfItems={handleSetNumberOfItems}
              onMouseMove={() => setSelectedItem(null)}
            />
          </CSSTransition>
        </Container>
      </>
    )
  }
)

Searchbar.displayName = 'Searchbar'
