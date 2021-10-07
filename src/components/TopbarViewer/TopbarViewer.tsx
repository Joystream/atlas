import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { QUERY_PARAMS, absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { Button } from '@/shared/components/Button'
import { IconButton } from '@/shared/components/IconButton'
import { Searchbar } from '@/shared/components/Searchbar'
import { SvgGlyphAddVideo } from '@/shared/icons'
import { SvgJoystreamLogoFull } from '@/shared/illustrations'
import { RoutingState } from '@/types/routing'

import { ButtonWrapper, Overlay, SearchbarContainer, StyledTopbarBase } from './TopbarViewer.style'

export const TopbarViewer: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as RoutingState
  const overlaidLocation = locationState?.overlaidLocation || location
  const mdMatch = useMediaMatch('md')
  const searchbarRef = useRef(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  // Lose focus on location change
  useEffect(() => {
    if (location.pathname) {
      setIsFocused(false)
    }
  }, [location.pathname])

  useEffect(() => {
    // focus the searchbar when visiting search (e.g. from a link)
    if (location.pathname.includes(absoluteRoutes.viewer.search())) {
      setIsFocused(true)
      if (location.search) {
        const params = new URLSearchParams(location.search)
        const query = params.get(QUERY_PARAMS.SEARCH)
        setSearchQuery(query || '')
      }
    }
  }, [location.pathname, location.search])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === 'NumpadEnter') && searchQuery.trim()) {
      const state: RoutingState = { overlaidLocation }

      // navigate to search results
      navigate(absoluteRoutes.viewer.search({ query: searchQuery.trim() }), { state })
    }
    if (e.key === 'Escape' || e.key === 'Esc') {
      handleBlur()
      e.currentTarget.blur()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFocused(true)
    setSearchQuery(e.currentTarget.value)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleCancel = () => {
    setSearchQuery('')
  }

  return (
    <StyledTopbarBase
      hasFocus={isFocused}
      noLogo={!mdMatch && !!searchQuery}
      fullLogoNode={<SvgJoystreamLogoFull />}
      logoLinkUrl={absoluteRoutes.viewer.index()}
    >
      <SearchbarContainer>
        <Searchbar
          placeholder="Search..."
          onChange={handleChange}
          value={searchQuery}
          onKeyDown={handleKeyPress}
          onFocus={handleFocus}
          onCancel={handleCancel}
          showCancelButton={!!searchQuery}
          onClose={handleBlur}
          controlled
          hasFocus={isFocused}
          onClick={handleFocus}
          ref={searchbarRef}
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
        {!searchQuery && !mdMatch && (
          <IconButton to={absoluteRoutes.studio.index()} newTab>
            <SvgGlyphAddVideo />
          </IconButton>
        )}
      </ButtonWrapper>
      {isFocused && <Overlay onClick={handleBlur} />}
    </StyledTopbarBase>
  )
}
