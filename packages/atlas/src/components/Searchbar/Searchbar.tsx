import {
  ChangeEvent,
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import { SvgActionChevronL, SvgActionClose, SvgActionSearch } from '@/assets/icons'
import { ShortcutIndicator } from '@/components/ShortcutIndicator'
import { Button } from '@/components/_buttons/Button'
import { QUERY_PARAMS, absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useRouterQuery } from '@/hooks/useRouterQuery'
import { usePersonalDataStore } from '@/providers/personalData'
import { useSearchStore } from '@/providers/search'

import { SearchBox } from './SearchBox'
import {
  CancelButton,
  Container,
  InnerContainer,
  Input,
  SearchButton,
  SearchHelper,
  StyledForm,
  StyledSvgOutlineSearch,
} from './Searchbar.styles'

type SearchbarProps = {
  onCancel?: () => void
  showCancelButton?: boolean
  controlled?: boolean
  onClick?: () => void
  onClose: () => void
  placeholder?: string
} & DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement>

export const Searchbar: FC<SearchbarProps> = ({
  placeholder,
  onChange,
  onFocus,
  onCancel,
  onBlur,
  onSubmit,
  onClick,
  onClose,
  onKeyDown,
  ...htmlProps
}) => {
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

  const handleSelectedItemReset = useCallback(() => {
    setSelectedItem(null)
  }, [])

  const handleClose = () => {
    onClose?.()
    handleSelectedItemReset()
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
      handleSelectedItemReset()
    }
  }, [handleSelectedItemReset, searchOpen])

  useEffect(() => {
    if (selectedItem === null || !searchOpen) {
      setRecentSearch(null)
    }
  }, [selectedItem, searchOpen])

  useEffect(() => {
    const onKeyPress = (event: KeyboardEvent) => {
      const isEventTargetAnInput =
        event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement

      if (!isEventTargetAnInput && event.key === '/') {
        event.preventDefault()
        onClick?.()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyPress)
    return () => {
      window.removeEventListener('keydown', onKeyPress)
    }
  }, [onClick, onClose, query])

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if ((event.key === 'Enter' || event.key === 'NumpadEnter') && query?.trim() && typeof selectedItem !== 'number') {
      event.preventDefault()
      handleClose()
      if (routerQuery !== searchQuery) {
        addRecentSearch(query)
        // navigate to search results
        navigate(absoluteRoutes.viewer.search({ query: query?.trim() }))
      }
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

  const onLastSelectedItem = useCallback(() => {
    setSelectedItem(null)
  }, [])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRecentSearch(null)
    handleSelectedItemReset()
    if (onChange) {
      onChange(event)
    }
  }
  const handleCancel = () => {
    inputRef.current?.focus()
    setRecentSearch(null)
    if (onCancel) {
      onCancel()
    }
  }

  const onSelectRecentSearch = useCallback(
    (title?: string) => {
      setRecentSearch(title)
      onClose()
    },
    [onClose]
  )

  const onSelectItem = useCallback((title?: string | null) => {
    setRecentSearch(title)
  }, [])

  const handleSetNumberOfItems = useCallback((items: number) => {
    setNumberOfItems(items)
  }, [])

  return (
    <>
      <Container hasFocus={searchOpen} hasQuery={!!query}>
        <InnerContainer hasFocus={searchOpen} hasQuery={!!query}>
          {(mdMatch || searchOpen || !!query) && (
            <>
              {!mdMatch && searchOpen ? (
                <Button
                  icon={<SvgActionChevronL />}
                  onClick={() => {
                    onClose()
                    if (!routerQuery) {
                      setSearchQuery('')
                    }
                  }}
                  variant="tertiary"
                />
              ) : (
                <StyledSvgOutlineSearch highlighted={searchOpen} width={24} height={24} />
              )}
              <StyledForm action=".">
                <Input
                  value={query}
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
          {!!query && <CancelButton icon={<SvgActionClose />} onClick={handleCancel} variant="tertiary" size="small" />}
          {!query && !searchOpen && (
            <>
              <SearchButton icon={<SvgActionSearch />} variant="tertiary" onClick={onClick} />
              <SearchHelper as="span" variant="t100" color="colorText">
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
            onMouseMove={handleSelectedItemReset}
            hasFocus={inputHasFocus}
          />
        </CSSTransition>
      </Container>
    </>
  )
}

Searchbar.displayName = 'Searchbar'
