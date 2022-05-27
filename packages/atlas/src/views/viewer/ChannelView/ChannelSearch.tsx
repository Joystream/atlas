import { Dispatch, FC, FormEvent, KeyboardEvent, SetStateAction, useCallback, useEffect, useRef } from 'react'

import { SvgActionSearch } from '@/components/_icons'

import { SearchButton, SearchContainerForm, StyledTextField } from './ChannelSearch.styles'
import { TABS } from './utils'

type SearchProps = {
  isSearchInputOpen: boolean
  setIsSearchingInputOpen: (isOpen: boolean) => void
  setIsSearching: (isOpen: boolean) => void
  isSearching?: boolean
  submitSearch: (searchQuery: string) => void
  setCurrentTab: (tab: typeof TABS[number]) => void
  searchQuery: string
  setSearchQuery: Dispatch<SetStateAction<string>>
}

export const ChannelSearch: FC<SearchProps> = ({
  isSearchInputOpen,
  setIsSearching,
  isSearching,
  submitSearch,
  setIsSearchingInputOpen,
  setSearchQuery,
  searchQuery,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleEscape = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        setIsSearchingInputOpen(false)
        event.currentTarget.blur()
        setSearchQuery('')
      }
    },
    [setIsSearchingInputOpen, setSearchQuery]
  )

  const toggleSearchInput = useCallback(() => {
    if (isSearchInputOpen) {
      setIsSearchingInputOpen(false)
      searchInputRef.current?.blur()
    } else {
      setIsSearchingInputOpen(true)
      searchInputRef.current?.focus()
    }
  }, [isSearchInputOpen, searchInputRef, setIsSearchingInputOpen])

  useEffect(() => {
    const onClickOutsideSearch = (event: Event) => {
      if (!isSearching && isSearchInputOpen && searchInputRef.current !== event.target) {
        toggleSearchInput()
      }
    }
    window.addEventListener('click', onClickOutsideSearch)
    return () => {
      window.removeEventListener('click', onClickOutsideSearch)
    }
  }, [isSearching, isSearchInputOpen, searchInputRef, searchQuery, setIsSearchingInputOpen, toggleSearchInput])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() === '') {
      setIsSearching(false)
    } else {
      submitSearch(searchQuery)
      setIsSearching(true)
    }
  }

  return (
    <SearchContainerForm onSubmit={handleSubmit}>
      <StyledTextField
        ref={searchInputRef}
        isOpen={isSearchInputOpen}
        isSearching={isSearching}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleEscape}
        placeholder="Search"
        type="search"
      />
      <SearchButton icon={<SvgActionSearch />} onClick={toggleSearchInput} variant="tertiary" />
    </SearchContainerForm>
  )
}
