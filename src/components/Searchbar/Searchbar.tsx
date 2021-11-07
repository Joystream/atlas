import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import { IconButton } from '@/components/IconButton'
import { ShortcutIndicator } from '@/components/ShortcutIndicator'
import { QUERY_PARAMS, absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useRouterQuery } from '@/hooks/useRouterQuery'
import { SvgGlyphChevronLeft, SvgGlyphClose, SvgGlyphSearch } from '@/icons'
import { usePersonalDataStore } from '@/providers/personalData'
import { useSearchStore } from '@/providers/search'

import { SearchBox } from './SearchBox'
import { SearchHelper } from './Searchbar.style'
import {
  CancelButton,
  Container,
  InnerContainer,
  Input,
  SearchButton,
  StyledForm,
  StyledSvgOutlineSearch,
} from './Searchbar.style'

type SearchbarProps = {
  onCancel?: () => void
  showCancelButton?: boolean
  controlled?: boolean
  onClick?: () => void
  onClose: () => void
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLInputElement>, HTMLInputElement>
export const Searchbar = React.forwardRef<HTMLDivElement, SearchbarProps>(
  ({ placeholder, onChange, onFocus, onCancel, onBlur, onSubmit, onClick, onClose, onKeyDown, ...htmlProps }, ref) => {
    const mdMatch = useMediaMatch('md')
    const [recentSearch, setRecentSearch] = useState<string | null | undefined>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [selectedItem, setSelectedItem] = useState<number | null>(null)
    const [numberOfItems, setNumberOfItems] = useState<number | null>(null)
    const [inputHasFocus, setInputHasFocus] = useState(false)
    const navigate = useNavigate()
    const routerQuery = useRouterQuery(QUERY_PARAMS.SEARCH)
    const {
      searchOpen,
      searchQuery,
      actions: { setSearchQuery },
    } = useSearchStore()
    const query = recentSearch || searchQuery
    const { addRecentSearch } = usePersonalDataStore((state) => ({
      addRecentSearch: state.actions.addRecentSearch,
    }))
    const { pathname } = useLocation()

    const handleClose = () => {
      onClose?.()
      setSelectedItem(null)
    }

    // Lose focus on location change
    useEffect(() => {
      if (pathname) {
        onClose?.()
        inputRef.current?.blur()
      }
    }, [pathname, onClose])

    useEffect(() => {
      if (searchOpen) {
        inputRef.current?.focus()
        setInputHasFocus(true)
      } else {
        setSelectedItem(null)
      }
    }, [searchOpen])

    useEffect(() => {
      if (selectedItem === null || !searchOpen) {
        setRecentSearch(null)
      }
    }, [selectedItem, searchOpen])

    useEffect(() => {
      const onKeyPress = (event: KeyboardEvent) => {
        if (event.key === '/' && !searchOpen) {
          event.preventDefault()
          onClick?.()
          inputRef.current?.focus()
        }
      }
      window.addEventListener('keydown', onKeyPress)
      return () => {
        window.removeEventListener('keydown', onKeyPress)
      }
    }, [onClick, onClose, query, searchOpen])

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if ((event.key === 'Enter' || event.key === 'NumpadEnter') && query?.trim() && !selectedItem) {
        event.preventDefault()
        addRecentSearch(query)
        handleClose()

        // navigate to search results
        navigate(absoluteRoutes.viewer.search({ query: query?.trim() }))
      }
      if (event.key === 'Escape' || event.key === 'Esc' || event.key === 'Tab') {
        event.preventDefault()
        event.currentTarget.blur()
        handleClose()
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
      inputRef.current?.focus()
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
        <Container hasFocus={searchOpen} ref={ref} hasQuery={!!query}>
          <InnerContainer hasFocus={searchOpen} hasQuery={!!query}>
            {(mdMatch || searchOpen || !!query) && (
              <>
                {!mdMatch && searchOpen ? (
                  <IconButton
                    onClick={() => {
                      onClose()
                      if (!routerQuery) {
                        setSearchQuery('')
                      }
                    }}
                    variant="tertiary"
                  >
                    <SvgGlyphChevronLeft />
                  </IconButton>
                ) : (
                  <StyledSvgOutlineSearch highlighted={searchOpen} width={24} height={24} />
                )}
                <StyledForm action=".">
                  <Input
                    value={query || ''}
                    placeholder={placeholder}
                    type="search"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={(event) => {
                      onFocus?.(event)
                      setInputHasFocus(true)
                    }}
                    onFocusCapture={onFocus}
                    onBlur={(event) => {
                      onBlur?.(event)
                      setInputHasFocus(false)
                    }}
                    onSubmit={onSubmit}
                    data-hj-allow
                    ref={inputRef}
                    {...htmlProps}
                  />
                </StyledForm>
              </>
            )}
            {!!query && (
              <CancelButton onClick={handleCancel} variant="tertiary" size="small">
                <SvgGlyphClose />
              </CancelButton>
            )}
            {!query && !searchOpen && (
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
          <CSSTransition classNames="searchbox" in={searchOpen} unmountOnExit mountOnEnter timeout={500}>
            <SearchBox
              searchQuery={searchQuery || ''}
              onSelectRecentSearch={onSelectRecentSearch}
              selectedItem={selectedItem}
              onLastSelectedItem={onLastSelectedItem}
              onSelectItem={onSelectItem}
              handleSetNumberOfItems={handleSetNumberOfItems}
              onMouseMove={() => setSelectedItem(null)}
              hasFocus={inputHasFocus}
            />
          </CSSTransition>
        </Container>
      </>
    )
  }
)

Searchbar.displayName = 'Searchbar'
