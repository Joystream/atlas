import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import { QUERY_PARAMS, absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useOverlayManager } from '@/providers/overlayManager'
import { useSearchStore } from '@/providers/search'
import { Button } from '@/shared/components/Button'
import { Searchbar } from '@/shared/components/Searchbar'
import { SvgGlyphAddVideo } from '@/shared/icons'
import { SvgJoystreamLogoFull } from '@/shared/illustrations'

import { ButtonWrapper, Overlay, SearchbarContainer, StyledIconButton, StyledTopbarBase } from './TopbarViewer.style'

export const TopbarViewer: React.FC = () => {
  const location = useLocation()
  const mdMatch = useMediaMatch('md')
  const { incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()
  const {
    searchOpen,
    searchQuery,
    actions: { setSearchOpen, setSearchQuery },
  } = useSearchStore()

  useEffect(() => {
    if (searchOpen) {
      incrementOverlaysOpenCount()
    } else {
      decrementOverlaysOpenCount()
    }
  }, [searchOpen, incrementOverlaysOpenCount, decrementOverlaysOpenCount])

  // Lose focus on location change
  useEffect(() => {
    if (location.pathname) {
      setSearchOpen(false)
    }
  }, [location.pathname, setSearchOpen])

  useEffect(() => {
    // focus the searchbar when visiting search (e.g. from a link)
    if (location.pathname.includes(absoluteRoutes.viewer.search())) {
      if (location.search) {
        const params = new URLSearchParams(location.search)
        const query = params.get(QUERY_PARAMS.SEARCH)
        setSearchQuery(query || '')
      }
    }
  }, [location.pathname, location.search, setSearchQuery])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchOpen(true)
    setSearchQuery(event.currentTarget.value)
  }

  const onClose = () => {
    setSearchOpen(false)
  }

  const handleFocus = () => {
    setSearchOpen(true)
  }

  const handleCancel = () => {
    setSearchQuery('')
  }

  return (
    <StyledTopbarBase
      hasFocus={searchOpen}
      noLogo={!mdMatch && !!searchQuery}
      fullLogoNode={<SvgJoystreamLogoFull />}
      logoLinkUrl={absoluteRoutes.viewer.index()}
    >
      <SearchbarContainer>
        <CSSTransition classNames="searchbar" in={searchOpen} timeout={0}>
          <Searchbar
            placeholder="Search..."
            onChange={handleChange}
            onFocus={handleFocus}
            onCancel={handleCancel}
            showCancelButton={!!searchQuery}
            onClose={onClose}
            controlled
            onClick={handleFocus}
          />
        </CSSTransition>
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
      <CSSTransition classNames="searchbar-overlay" in={searchOpen} timeout={0} unmountOnExit mountOnEnter>
        <Overlay onClick={onClose} />
      </CSSTransition>
    </StyledTopbarBase>
  )
}
