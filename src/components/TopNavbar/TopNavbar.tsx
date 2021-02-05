import routes, { QUERY_PARAMS } from '@/config/routes'
import { useLocation, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import {
  FullLogo,
  Header,
  LogoLink,
  NavigationContainer,
  SearchbarContainer,
  ShortLogo,
  StyledSearchbar,
} from './TopNavbar.style'
import { RoutingState } from '@/types/routing'

const TopNavbar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as RoutingState
  const overlaidLocation = locationState?.overlaidLocation || location

  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (isFocused && location.pathname !== routes.search()) {
      setSearchQuery('')
      setIsFocused(false)
    }
  }, [isFocused, location.pathname])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === 'NumpadEnter') && searchQuery.trim()) {
      // TODO possibly move to routes
      const searchQueryParams = new URLSearchParams()
      searchQueryParams.set(QUERY_PARAMS.SEARCH, searchQuery.trim())
      const searchUrl = `${routes.search()}?${searchQueryParams.toString()}`

      const state: RoutingState = { overlaidLocation }

      navigate(searchUrl, { state })
    }
    if (e.key === 'Escape' || e.key === 'Esc') {
      handleCancel()
      e.currentTarget.blur()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFocused(true)
    setSearchQuery(e.currentTarget.value)
  }

  const handleFocus = () => {
    setIsFocused(true)
    // TODO open search overlay

    if (location.pathname !== routes.search()) {
      const state: RoutingState = { overlaidLocation }

      navigate(routes.search(), { state })
    }
  }

  const handleCancel = () => {
    setSearchQuery('')
    setIsFocused(false)

    const overlaidLocation = locationState?.overlaidLocation

    if (overlaidLocation) {
      navigate(overlaidLocation)
    }
  }
  return (
    <Header hasFocus={isFocused}>
      <NavigationContainer>
        <LogoLink to="/">
          <ShortLogo />
          <FullLogo />
        </LogoLink>
      </NavigationContainer>
      <SearchbarContainer>
        <StyledSearchbar
          placeholder="Search..."
          onChange={handleChange}
          value={searchQuery}
          onKeyDown={handleKeyPress}
          onFocus={handleFocus}
          onCancel={handleCancel}
          showCancelButton={isFocused}
          controlled
        />
      </SearchbarContainer>
    </Header>
  )
}

export default TopNavbar
