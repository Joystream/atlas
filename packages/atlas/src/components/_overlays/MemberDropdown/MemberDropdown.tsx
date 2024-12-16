import { BN } from 'bn.js'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { mergeRefs } from 'react-merge-refs'
import { useNavigate } from 'react-router'
import { CSSTransition } from 'react-transition-group'
import useResizeObserver from 'use-resize-observer'

import { useGetFullCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { StartRevenueShare } from '@/components/_crt/StartRevenueShareModal'
import { absoluteRoutes } from '@/config/routes'
import { useAuth } from '@/providers/auth/auth.hooks'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useSubscribeAccountBalance } from '@/providers/joystream'
import { UseNotifications } from '@/providers/notifications/notifications.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { transitions } from '@/styles'

import { Container, InnerContainer, SlideAnimationContainer } from './MemberDropdown.styles'
import { MemberDropdownList } from './MemberDropdownList'
import { MemberDropdownNav } from './MemberDropdownNav'

import { SendFundsDialog } from '../SendTransferDialogs'

export type MemberDropdownProps = {
  unseenNotificationsCounts?: UseNotifications['unseenNotificationsCounts']
  isActive: boolean
  publisher?: boolean
  closeDropdown?: () => void
  onChannelChange?: (channelId: string) => void
}

export const MemberDropdown = forwardRef<HTMLDivElement, MemberDropdownProps>(
  ({ publisher, unseenNotificationsCounts, isActive, closeDropdown, onChannelChange }, ref) => {
    const navigate = useNavigate()
    const { channelId, activeMembership, memberships, setActiveChannel, activeChannel } = useUser()
    const { handleLogout } = useAuth()
    const {
      actions: { setAuthModalOpenName },
    } = useAuthStore()
    const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
    const [disableScrollDuringAnimation, setDisableScrollDuringAnimation] = useState(true)
    const [openRevenueShareModal, setOpenRevenueShareModal] = useState(false)

    const [showSendDialog, setShowSendDialog] = useState(false)
    const selectedChannel = activeMembership?.channels.find((chanel) => chanel.id === channelId)
    const { data: tokenData } = useGetFullCreatorTokenQuery({
      variables: {
        id: activeChannel?.creatorToken?.token.id ?? '',
      },
      skip: !activeChannel?.creatorToken?.token.id,
    })
    const memoizedChannelStateBloatBond = useMemo(() => {
      return new BN(selectedChannel?.channelStateBloatBond || 0)
    }, [selectedChannel?.channelStateBloatBond])

    const { accountBalance, lockedAccountBalance, totalBalance, totalInvitationLock } = useSubscribeAccountBalance()
    const { accountBalance: channelBalance } =
      useSubscribeAccountBalance(selectedChannel?.rewardAccount, {
        channelStateBloatBond: memoizedChannelStateBloatBond,
      }) || new BN(0)

    const hasOneMember = memberships?.length === 1

    const [dropdownType, setDropdownType] = useState<'channel' | 'member'>(publisher ? 'channel' : 'member')
    const [isList, setIsList] = useState(false)
    const { ref: measureContainerRef, height: measureContainerHeight = 0 } = useResizeObserver<HTMLDivElement>({
      box: 'border-box',
    })
    const containerRef = useRef<HTMLDivElement>(null)

    const handleAddNewChannel = useCallback(() => {
      setAuthModalOpenName('createChannel')
      closeDropdown?.()
    }, [closeDropdown, setAuthModalOpenName])

    const handleChannelChange = useCallback(
      (channelId: string) => {
        if (dropdownType === 'channel') {
          setDropdownType('channel')
          setIsList(false)
          setActiveChannel(channelId)
          onChannelChange?.(channelId)
        }

        if (dropdownType === 'member') {
          navigate(absoluteRoutes.viewer.channel(channelId))
          closeDropdown?.()
        }
      },
      [closeDropdown, dropdownType, navigate, onChannelChange, setActiveChannel]
    )

    const handleSwitch = useCallback((type: 'channel' | 'member', changeToList: boolean) => {
      setDropdownType(type)
      setIsList(changeToList)
    }, [])

    const toggleWithdrawDialog = () => setShowWithdrawDialog((prevState) => !prevState)
    const toggleSendDialog = () => setShowSendDialog((prevState) => !prevState)

    useEffect(() => {
      setDropdownType(publisher ? 'channel' : 'member')
    }, [publisher])

    useEffect(() => {
      if (!isActive) {
        return
      }
      const handleClickOutside = (event: Event) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          // stop propagation so drawer doesn't get triggered again on button click
          // prevent default so it doesn't trigger unwanted submit e.g. in Channel Edit View
          event.preventDefault()
          event.stopPropagation()
          closeDropdown?.()
        }
      }
      document.addEventListener('click', handleClickOutside, true)
      return () => {
        document.removeEventListener('click', handleClickOutside, true)
      }
    }, [closeDropdown, isActive])

    const resetToDefaultState = useCallback(() => {
      setDisableScrollDuringAnimation(false)
      if (isActive) {
        return
      }
      setIsList(false)
      setDropdownType(publisher ? 'channel' : 'member')
    }, [isActive, publisher])

    return (
      <>
        <SendFundsDialog
          activeMembership={activeMembership}
          show={showWithdrawDialog}
          onExitClick={toggleWithdrawDialog}
          channelBalance={channelBalance}
          totalBalance={totalBalance}
          channelId={channelId}
        />
        {tokenData?.creatorTokenById ? (
          <StartRevenueShare
            show={openRevenueShareModal}
            token={tokenData.creatorTokenById}
            onClose={() => setOpenRevenueShareModal(false)}
          />
        ) : null}
        <SendFundsDialog show={showSendDialog} onExitClick={toggleSendDialog} accountBalance={accountBalance} />

        <CSSTransition classNames={transitions.names.dropdown} in={isActive} timeout={0} mountOnEnter unmountOnExit>
          <Container ref={mergeRefs([ref, containerRef])}>
            <InnerContainer
              onTransitionEnd={resetToDefaultState}
              isActive={isActive}
              containerHeight={measureContainerHeight}
              disableVerticalScroll={disableScrollDuringAnimation}
            >
              <SlideAnimationContainer disableVerticalScroll={disableScrollDuringAnimation}>
                <div
                  ref={(ref) => {
                    measureContainerRef(ref)
                  }}
                >
                  <CSSTransition
                    timeout={0}
                    in={!isList}
                    classNames={transitions.names.enterFromLeft}
                    onEntering={() => setDisableScrollDuringAnimation(true)}
                    onExiting={() => setDisableScrollDuringAnimation(true)}
                    unmountOnExit
                    mountOnEnter
                  >
                    <MemberDropdownNav
                      containerRefElement={containerRef.current}
                      channelId={channelId}
                      unseenNotificationsCounts={unseenNotificationsCounts}
                      onSignOut={handleLogout}
                      onShowFundsDialog={() => {
                        if (dropdownType === 'channel') {
                          activeChannel?.creatorToken?.token.id
                            ? setOpenRevenueShareModal(true)
                            : setShowWithdrawDialog(true)
                          return
                        }

                        setShowSendDialog(true)
                      }}
                      accountBalance={accountBalance}
                      onAddNewChannel={handleAddNewChannel}
                      channelBalance={channelBalance}
                      lockedAccountBalance={lockedAccountBalance}
                      activeMembership={activeMembership}
                      activeChannel={activeChannel}
                      hasOneMember={hasOneMember}
                      onSwitchToList={(type) => handleSwitch(type, true)}
                      onCloseDropdown={closeDropdown}
                      publisher={publisher}
                      type={dropdownType}
                      isInDebt={totalBalance && totalInvitationLock && totalBalance?.sub(totalInvitationLock).isNeg()}
                    />
                  </CSSTransition>
                  <CSSTransition
                    timeout={0}
                    in={isList}
                    classNames={transitions.names.enterFromRight}
                    unmountOnExit
                    mountOnEnter
                  >
                    <MemberDropdownList
                      channelId={channelId}
                      channelNotificationCounts={unseenNotificationsCounts?.channels?.channels}
                      activeMembership={activeMembership}
                      onChannelChange={handleChannelChange}
                      onAddNewChannel={handleAddNewChannel}
                      onSwitchToNav={(type) => handleSwitch(type, false)}
                      type={dropdownType}
                    />
                  </CSSTransition>
                </div>
              </SlideAnimationContainer>
            </InnerContainer>
          </Container>
        </CSSTransition>
      </>
    )
  }
)
MemberDropdown.displayName = 'MemberDropdown'
