import styled from '@emotion/styled'
import React, { useCallback, useMemo, useRef, useState } from 'react'

import { AssetAvailability, SearchQuery, VideoFieldsFragment, useSearchLazyQuery } from '@/api/queries'
import { SvgGlyphSearch } from '@/shared/icons'
import { colors, transitions } from '@/shared/theme'

import { IconButton } from '../IconButton'
import { TextField } from '../TextField'

export type SearchProps = {
  searchInputRef: React.RefObject<HTMLInputElement>
  isSearchInputOpen: boolean
  setIsSearchingInputOpen: (isOpen: boolean) => void
  setIsSearching: (isOpen: boolean) => void
  search: (searchQuery: string) => void
  width?: string
  className?: string
}
export const Search: React.FC<SearchProps> = ({
  searchInputRef,
  isSearchInputOpen,
  setIsSearching,
  search,
  setIsSearchingInputOpen,
  width,
  className,
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
    [search, searchInputRef, searchQuery, setIsSearching, setIsSearchingInputOpen, setSearchQuery]
  )

  return (
    <SearchContainer className={className}>
      <StyledTextField
        width={width}
        ref={searchInputRef}
        isOpen={isSearchInputOpen}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearchInputKeyPress}
        placeholder="Search"
        type="search"
        helperText={null}
      />
      <SearchButton
        onClick={() => {
          setIsSearchingInputOpen(true)
          searchInputRef.current?.focus()
        }}
        variant="tertiary"
      >
        <SvgGlyphSearch />
      </SearchButton>
    </SearchContainer>
  )
}

const getVideosFromSearch = (loading: boolean, data: SearchQuery['search'] | undefined) => {
  if (loading || !data) {
    return { channels: [], videos: [] }
  }
  const searchVideos: Array<{ __typename?: 'Video' } & VideoFieldsFragment> = data.flatMap((result) =>
    result.item.__typename === 'Video' ? [result.item] : []
  )
  return { searchVideos }
}
type UseSearchVideosParams = {
  id: string
  onError: (error: unknown) => void
}

export const useSearchVideos = ({ id, onError }: UseSearchVideosParams) => {
  const [isSearchInputOpen, setIsSearchingInputOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchVideo, { loading: loadingSearch, data: searchData, error: errorSearch }] = useSearchLazyQuery({
    onError,
  })
  const searchInputRef = useRef<HTMLInputElement>(null)
  const search = useCallback(
    (searchQuery: string) => {
      setSearchQuery(searchQuery)
      searchVideo({
        variables: {
          text: searchQuery,
          whereVideo: {
            isPublic_eq: true,
            mediaAvailability_eq: AssetAvailability.Accepted,
            thumbnailPhotoAvailability_eq: AssetAvailability.Accepted,
            channelId_eq: id,
          },
          limit: 100,
        },
      })
    },
    [id, searchVideo]
  )

  const { searchVideos } = useMemo(
    () => getVideosFromSearch(loadingSearch, searchData?.search),
    [loadingSearch, searchData]
  )

  return {
    searchVideos,
    search,
    loadingSearch,
    isSearchInputOpen,
    setIsSearchingInputOpen,
    errorSearch,
    isSearching,
    setIsSearching,
    searchInputRef,
    searchQuery,
  }
}

type TextFieldProps = {
  isOpen?: boolean
  width?: string
}
const StyledTextField = styled(TextField)<TextFieldProps>`
  transition: all ${transitions.timings.regular} ${transitions.easing};
  will-change: max-width;
  width: 100%;
  align-items: center;
  max-width: ${({ isOpen, width }) => (isOpen ? width ?? '100%' : '0px')};

  > input {
    ${({ isOpen }) => isOpen === false && 'border: none !important'};

    padding: 10px 16px 10px 42px;
    caret-color: ${colors.blue[500]};

    &:focus {
      border: 1px solid ${colors.white};
    }

    ::-webkit-search-cancel-button {
      -webkit-appearance: none;
    }
  }
`

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

const SearchButton = styled(IconButton)`
  position: absolute;
`
