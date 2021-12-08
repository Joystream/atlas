import React, { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import { Searchbar } from '@/components/Searchbar'
import { Button } from '@/components/_buttons/Button'
import { SvgActionAddVideo, SvgMember } from '@/components/_icons'
import { SvgJoystreamLogoFull } from '@/components/_illustrations'
import { QUERY_PARAMS, absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useOverlayManager } from '@/providers/overlayManager'
import { useSearchStore } from '@/providers/search'

import { ButtonWrapper, Overlay, SearchbarContainer, StyledIconButton, StyledTopbarBase } from './TopbarViewer.styles'

export const TopbarViewer: React.FC = () => {
  // TODO: This needs to be replaced by real logging mechanism
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const location = useLocation()
  const mdMatch = useMediaMatch('md')
  const { incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()
  const {
    searchOpen,
    searchQuery,
    actions: { setSearchOpen, setSearchQuery },
  } = useSearchStore()

  const handleLogging = () => {
    setIsLoggedIn((prevState) => !prevState)
  }

  useEffect(() => {
    if (searchOpen) {
      incrementOverlaysOpenCount()
    } else {
      decrementOverlaysOpenCount()
    }
  }, [searchOpen, incrementOverlaysOpenCount, decrementOverlaysOpenCount])

  // set input search query on results page
  useEffect(() => {
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

  const onClose = useCallback(() => {
    setSearchOpen(false)
  }, [setSearchOpen])

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
        {mdMatch &&
          (isLoggedIn ? (
            <Button
              icon={<SvgActionAddVideo />}
              iconPlacement="left"
              size="medium"
              onClick={handleLogging}
              variant="secondary"
            >
              Upload video
            </Button>
          ) : (
            <Button icon={<SvgMember />} iconPlacement="left" size="medium" onClick={handleLogging}>
              Sign up
            </Button>
          ))}
        {!searchQuery && !mdMatch && !isLoggedIn && (
          <>
            <StyledIconButton onClick={handleLogging}>Sign up</StyledIconButton>
          </>
        )}
      </ButtonWrapper>
      <CSSTransition classNames="searchbar-overlay" in={searchOpen} timeout={0} unmountOnExit mountOnEnter>
        <Overlay onClick={onClose} />
      </CSSTransition>
    </StyledTopbarBase>
  )
}
