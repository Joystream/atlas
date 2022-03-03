import React, { useCallback, useEffect, useState } from 'react'

import { SvgActionSearch } from '@/components/_icons'

import { SearchButton, SearchContainer, StyledTextField } from './ChannelSearch.styles'

import { TABS } from '.'

type SearchProps = {
  searchInputRef: React.RefObject<HTMLInputElement>
  isSearchInputOpen: boolean
  setIsSearchingInputOpen: (isOpen: boolean) => void
  setIsSearching: (isOpen: boolean) => void
  isSearching?: boolean
  search: (searchQuery: string) => void
  setCurrentTab: (tab: typeof TABS[number]) => void
}

export const ChannelSearch: React.FC<SearchProps> = ({
  searchInputRef,
  isSearchInputOpen,
  setIsSearching,
  isSearching,
  search,
  setIsSearchingInputOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const handleSearchInputKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' || event.key === 'NumpadEnter') {
        if (searchQuery.trim() === '') {
          setSearchQuery('')
          setIsSearching(false)
        } else {
          search(searchQuery)
          setIsSearching(true)
        }
      }
      if (event.key === 'Escape' || event.key === 'Esc') {
        setIsSearchingInputOpen(false)
        searchInputRef.current?.blur()
        setSearchQuery('')
      }
    },
    [search, searchInputRef, searchQuery, setIsSearching, setIsSearchingInputOpen]
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

  return (
    <SearchContainer isOpen={isSearchInputOpen}>
      <StyledTextField
        ref={searchInputRef}
        isOpen={isSearchInputOpen}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearchInputKeyPress}
        placeholder="Search"
        type="search"
        isSearching={isSearching}
      />
      <SearchButton onClick={toggleSearchInput} variant="tertiary" isSearching={isSearching} isOpen={isSearchInputOpen}>
        <SvgActionSearch />
      </SearchButton>
    </SearchContainer>
  )
}
