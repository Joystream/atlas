import { ChangeEvent, FC, MouseEvent, useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { SvgActionMember } from '@/assets/icons'
import { AppLogo } from '@/components/AppLogo'
import { Searchbar } from '@/components/Searchbar'
import { Button } from '@/components/_buttons/Button'
import { NotificationsButton } from '@/components/_navigation/NotificationsButton'
import { NotificationsWidget } from '@/components/_notifications/NotificationsWidget'
import { MemberDropdown } from '@/components/_overlays/MemberDropdown'
import { QUERY_PARAMS, absoluteRoutes } from '@/config/routes'
import { useDisplaySignInDialog } from '@/hooks/useDisplaySignInDialog'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useOverlayManager } from '@/providers/overlayManager'
import { useSearchStore } from '@/providers/search'
import { useUser } from '@/providers/user/user.hooks'
import { cVar, transitions } from '@/styles'

import {
  ButtonWrapper,
  Overlay,
  SearchbarContainer,
  SignedButtonsWrapper,
  StyledAvatar,
  StyledButtonSkeletonLoader,
  StyledIconButton,
  StyledTopbarBase,
} from './TopbarViewer.styles'

export const TopbarViewer: FC = () => {
  const { isLoggedIn, activeMembership, signIn, isAuthLoading } = useUser()
  const [isMemberDropdownActive, setIsMemberDropdownActive] = useState(false)

  const { url: memberAvatarUrl, isLoadingAsset: memberAvatarLoading } = getMemberAvatar(activeMembership)

  const { pathname, search } = useLocation()
  const mdMatch = useMediaMatch('md')
  const { incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()
  const {
    searchOpen,
    searchQuery,
    actions: { setSearchOpen, setSearchQuery },
  } = useSearchStore()
  const { openSignInDialog } = useDisplaySignInDialog()

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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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

  const handleDrawerToggle = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setIsMemberDropdownActive(!isMemberDropdownActive)
  }

  const topbarButtonLoaded = !isAuthLoading

  return (
    <>
      <StyledTopbarBase
        hasFocus={searchOpen}
        noLogo={!mdMatch && !!searchQuery}
        fullLogoNode={<AppLogo variant="full" height={32} width={undefined} />}
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
        {(!searchQuery || mdMatch) && (
          <SwitchTransition>
            <CSSTransition
              key={String(topbarButtonLoaded)}
              mountOnEnter
              classNames={transitions.names.fade}
              timeout={parseInt(cVar('animationTimingFast', true))}
            >
              <ButtonWrapper>
                {topbarButtonLoaded ? (
                  isLoggedIn ? (
                    <SignedButtonsWrapper>
                      <NotificationsWidget trigger={<NotificationsButton />} />
                      {!mdMatch && !searchOpen && (
                        <StyledAvatar
                          size={40}
                          assetUrl={memberAvatarUrl}
                          loading={memberAvatarLoading}
                          onClick={handleDrawerToggle}
                        />
                      )}
                      {mdMatch && (
                        <StyledAvatar
                          size={40}
                          assetUrl={memberAvatarUrl}
                          onClick={handleDrawerToggle}
                          loading={memberAvatarLoading}
                        />
                      )}
                    </SignedButtonsWrapper>
                  ) : (
                    mdMatch && (
                      <Button
                        icon={<SvgActionMember />}
                        iconPlacement="left"
                        size="medium"
                        onClick={() => signIn(undefined, openSignInDialog)}
                      >
                        Log in
                      </Button>
                    )
                  )
                ) : (
                  <SignedButtonsWrapper>
                    <StyledButtonSkeletonLoader width={mdMatch ? 102 : 78} height={40} />
                  </SignedButtonsWrapper>
                )}
                {!searchQuery && !mdMatch && !isLoggedIn && topbarButtonLoaded && (
                  <StyledIconButton onClick={() => signIn(undefined, openSignInDialog)}>Log in</StyledIconButton>
                )}
              </ButtonWrapper>
            </CSSTransition>
          </SwitchTransition>
        )}
        <CSSTransition classNames="searchbar-overlay" in={searchOpen} timeout={0} unmountOnExit mountOnEnter>
          <Overlay onClick={onClose} />
        </CSSTransition>
      </StyledTopbarBase>
      <MemberDropdown isActive={isMemberDropdownActive} closeDropdown={() => setIsMemberDropdownActive(false)} />
    </>
  )
}
