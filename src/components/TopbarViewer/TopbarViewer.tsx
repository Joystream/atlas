import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { QUERY_PARAMS, absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useOverlayManager } from '@/providers/overlayManager'
import { usePersonalDataStore } from '@/providers/personalData'
import { Button } from '@/shared/components/Button'
import { Searchbar } from '@/shared/components/Searchbar'
import { SvgGlyphAddVideo } from '@/shared/icons'
import { SvgJoystreamLogoFull } from '@/shared/illustrations'
import { RoutingState } from '@/types/routing'

import { ButtonWrapper, Overlay, SearchbarContainer, StyledIconButton, StyledTopbarBase } from './TopbarViewer.style'

export const TopbarViewer: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as RoutingState
  const overlaidLocation = locationState?.overlaidLocation || location
  const mdMatch = useMediaMatch('md')
  const { addRecentSearch } = usePersonalDataStore((state) => ({
    addRecentSearch: state.actions.addRecentSearch,
  }))
  const { incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()

  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (isFocused) {
      incrementOverlaysOpenCount()
    } else {
      decrementOverlaysOpenCount()
    }
  }, [decrementOverlaysOpenCount, incrementOverlaysOpenCount, isFocused])

  // Lose focus on location change
  useEffect(() => {
    if (location.pathname) {
      setIsFocused(false)
    }
  }, [location.pathname])

  useEffect(() => {
    // focus the searchbar when visiting search (e.g. from a link)
    if (location.pathname.includes(absoluteRoutes.viewer.search())) {
      if (location.search) {
        const params = new URLSearchParams(location.search)
        const query = params.get(QUERY_PARAMS.SEARCH)
        setSearchQuery(query || '')
      }
    }
  }, [location.pathname, location.search])

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event.key === 'Enter' || event.key === 'NumpadEnter') && searchQuery.trim()) {
      setIsFocused(false)
      const state: RoutingState = { overlaidLocation }
      addRecentSearch(new Date().getTime(), searchQuery)

      // navigate to search results
      navigate(absoluteRoutes.viewer.search({ query: searchQuery.trim() }), { state })
    }
    if (event.key === 'Escape' || event.key === 'Esc') {
      handleBlur()
      event.currentTarget.blur()
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFocused(true)
    setSearchQuery(event.currentTarget.value)
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
          <StyledIconButton to={absoluteRoutes.studio.index()} newTab>
            <SvgGlyphAddVideo />
          </StyledIconButton>
        )}
      </ButtonWrapper>
      {isFocused && <Overlay onClick={handleBlur} />}
    </StyledTopbarBase>
  )
}
