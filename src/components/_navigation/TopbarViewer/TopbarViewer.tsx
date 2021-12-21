import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import { Searchbar } from '@/components/Searchbar'
import { Button } from '@/components/_buttons/Button'
import { SvgActionAddVideo, SvgActionMember } from '@/components/_icons'
import { SvgJoystreamLogoFull } from '@/components/_illustrations'
import { Loader } from '@/components/_loaders/Loader'
import { Modal } from '@/components/_overlays/Modal'
import { QUERY_PARAMS, absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useOverlayManager } from '@/providers/overlayManager'
import { useSearchStore } from '@/providers/search'
import { useUser } from '@/providers/user'

import {
  ButtonWrapper,
  Overlay,
  SearchbarContainer,
  SignedButtonsWrapper,
  StyledAvatar,
  StyledIconButton,
  StyledTopbarBase,
} from './TopbarViewer.styles'

export const TopbarViewer: React.FC = () => {
  const { activeAccountId, extensionConnected, activeMemberId, activeMembership, signIn } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const isLoggedIn = !!activeAccountId && !!activeMemberId && !!extensionConnected

  const { pathname, search } = useLocation()
  const mdMatch = useMediaMatch('md')
  const { incrementOverlaysOpenCount, decrementOverlaysOpenCount, overlaysOpenCount } = useOverlayManager()
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

  // set input search query on results page
  useEffect(() => {
    if (pathname.includes(absoluteRoutes.viewer.search())) {
      if (search) {
        const params = new URLSearchParams(search)
        const query = params.get(QUERY_PARAMS.SEARCH)
        setSearchQuery(query || '')
      }
    }
  }, [pathname, search, setSearchQuery])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchOpen(true)
    setSearchQuery(event.currentTarget.value)
  }

  const handleSignIn = async () => {
    setIsLoading(true)
    await signIn()
    setIsLoading(false)
    if (!activeAccountId && !activeMemberId) {
      navigate(`${pathname}?step=1`)
    }
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
    <>
      <Modal show={isLoading} noBoxShadow>
        <Loader variant="xlarge" />
      </Modal>
      <StyledTopbarBase
        hasFocus={searchOpen}
        noLogo={!mdMatch && !!searchQuery}
        fullLogoNode={<SvgJoystreamLogoFull />}
        logoLinkUrl={absoluteRoutes.viewer.index()}
      >
        <SearchbarContainer>
          <CSSTransition classNames="searchbar" in={searchOpen} timeout={0}>
            <Searchbar
              hotkeysDisabled={overlaysOpenCount === 1}
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
          {!mdMatch && isLoggedIn && !searchOpen && (
            <StyledAvatar size="small" assetUrl={activeMembership?.avatarUri} />
          )}
        </SearchbarContainer>
        <ButtonWrapper>
          {mdMatch &&
            (isLoggedIn ? (
              <SignedButtonsWrapper>
                <Button
                  icon={<SvgActionAddVideo />}
                  iconPlacement="left"
                  size="medium"
                  newTab
                  to={absoluteRoutes.studio.index()}
                  variant="secondary"
                >
                  Go to Studio
                </Button>
                <StyledAvatar size="small" assetUrl={activeMembership?.avatarUri} />
              </SignedButtonsWrapper>
            ) : (
              <Button
                icon={<SvgActionMember />}
                iconPlacement="left"
                size="medium"
                onClick={handleSignIn}
                // to={`${pathname}?step=1`}
              >
                Sign In
              </Button>
            ))}
          {!searchQuery && !mdMatch && !isLoggedIn && (
            <StyledIconButton onClick={handleSignIn}>Sign In</StyledIconButton>
          )}
        </ButtonWrapper>
        <CSSTransition classNames="searchbar-overlay" in={searchOpen} timeout={0} unmountOnExit mountOnEnter>
          <Overlay onClick={onClose} />
        </CSSTransition>
      </StyledTopbarBase>
    </>
  )
}
