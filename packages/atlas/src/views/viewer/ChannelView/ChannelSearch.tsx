import { Dispatch, FC, FormEvent, SetStateAction, useCallback, useEffect, useRef } from 'react'

import { Button } from '@/components/_buttons/Button'
import { SvgActionClose, SvgActionSearch } from '@/components/_icons'

import { SearchContainerForm, StyledInput } from './ChannelSearch.styles'

type SearchProps = {
  isSearchInputOpen: boolean
  setIsSearchingInputOpen: (isOpen: boolean) => void
  setIsSearching: (isOpen: boolean) => void
  isSearching?: boolean
  submitSearch: (searchQuery: string) => void
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
  useEffect(() => {
    if (isSearchInputOpen) {
      searchInputRef.current?.focus()
    }
  }, [isSearchInputOpen])

  const toggleSearchInput = useCallback(() => {
    if (isSearchInputOpen) {
      setIsSearchingInputOpen(false)
      searchInputRef.current?.blur()
    } else {
      setIsSearchingInputOpen(true)
      searchInputRef.current?.focus()
    }
  }, [isSearchInputOpen, setIsSearchingInputOpen])

  const handleCloseButton = () => {
    if (searchQuery) {
      setSearchQuery('')
    } else {
      searchInputRef.current?.blur()
    }
  }
  const handleInputBlur = () => {
    if (!searchQuery) {
      setIsSearchingInputOpen(false)
      setIsSearching(false)
    }
  }
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
      {!isSearchInputOpen ? (
        <Button icon={<SvgActionSearch />} onClick={toggleSearchInput} variant="tertiary" />
      ) : (
        <StyledInput
          nodeStart={<SvgActionSearch />}
          size="medium"
          ref={searchInputRef}
          isOpen={isSearchInputOpen}
          isSearching={isSearching}
          value={searchQuery}
          onBlur={handleInputBlur}
          actionButton={{
            icon: <SvgActionClose />,
            onClick: handleCloseButton,
          }}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          type="search"
        />
      )}
    </SearchContainerForm>
  )
}
