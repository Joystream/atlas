import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { QUERY_PARAMS, absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { Button } from '@/shared/components/Button'
import { IconButton } from '@/shared/components/IconButton'
import { SvgGlyphAddVideo } from '@/shared/icons'
import { SvgJoystreamLogoFull } from '@/shared/illustrations'
import { RoutingState } from '@/types/routing'

import { ButtonWrapper, SearchbarContainer, StyledSearchbar, StyledTopbarBase } from './TopbarViewer.style'

export const TopbarViewer: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as RoutingState
  const overlaidLocation = locationState?.overlaidLocation || location
  const mdMatch = useMediaMatch('md')

  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    // close the searchbar on external navigation
    if (isFocused && !location.pathname.includes(absoluteRoutes.viewer.search())) {
      setSearchQuery('')
      setIsFocused(false)
    }

    // focus the searchbar when visiting search (e.g. from a link)
    if (!isFocused && location.pathname.includes(absoluteRoutes.viewer.search())) {
      setIsFocused(true)
      if (location.search) {
        const params = new URLSearchParams(location.search)
        const query = params.get(QUERY_PARAMS.SEARCH)
        setSearchQuery(query || '')
      }
    }
  }, [isFocused, location.pathname, location.search])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === 'NumpadEnter') && searchQuery.trim()) {
      const state: RoutingState = { overlaidLocation }

      // navigate to search results
      navigate(absoluteRoutes.viewer.search({ query: searchQuery.trim() }), { state })
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

    // open the search overlay if not already visible
    if (!location.pathname.includes(absoluteRoutes.viewer.search())) {
      const state: RoutingState = { overlaidLocation }

      navigate(absoluteRoutes.viewer.search(), { state })
    }
  }

  const handleCancel = () => {
    setSearchQuery('')
    setIsFocused(false)

    // navigate to overlaid view or home on searchbar close
    const overlaidLocation = locationState?.overlaidLocation || { pathname: absoluteRoutes.viewer.index() }
    navigate(overlaidLocation)
  }

  return (
    <StyledTopbarBase
      hasFocus={isFocused}
      noLogo={!mdMatch && isFocused}
      fullLogoNode={<SvgJoystreamLogoFull />}
      logoLinkUrl={absoluteRoutes.viewer.index()}
    >
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
          hasFocus={isFocused}
          onClick={handleFocus}
        />
      </SearchbarContainer>
      <ButtonWrapper>
        {mdMatch && (
          <Button
            to={absoluteRoutes.studio.index()}
            newTab
            icon={<SvgGlyphAddVideo />}
            iconPlacement="left"
            size="medium"
          >
            Start publishing
          </Button>
        )}
        {!isFocused && !mdMatch && (
          <IconButton to={absoluteRoutes.studio.index()} newTab>
            <SvgGlyphAddVideo />
          </IconButton>
        )}
      </ButtonWrapper>
    </StyledTopbarBase>
  )
}
