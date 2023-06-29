import bezier from 'bezier-easing'
import { BN } from 'bn.js'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { mergeRefs } from 'react-merge-refs'
import { useNavigate } from 'react-router'
import { useTransition } from 'react-spring'
import useResizeObserver from 'use-resize-observer'

import { absoluteRoutes } from '@/config/routes'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useSubscribeAccountBalance } from '@/providers/joystream/joystream.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { cVar } from '@/styles'

import { Container, InnerContainer, SlideAnimationContainer } from './MemberDropdown.styles'
import { MemberDropdownList } from './MemberDropdownList'
import { MemberDropdownNav } from './MemberDropdownNav'

import { SendFundsDialog, WithdrawFundsDialog } from '../SendTransferDialogs'

export type MemberDropdownProps = {
  isActive: boolean
  publisher?: boolean
  closeDropdown?: () => void
  onChannelChange?: (channelId: string) => void
}

export const MemberDropdown = forwardRef<HTMLDivElement, MemberDropdownProps>(
  ({ publisher, isActive, closeDropdown, onChannelChange }, ref) => {
    const navigate = useNavigate()
    const { channelId, activeMembership, memberships, signOut, setActiveUser, setSignInModalOpen, membershipsLoading } =
      useUser()
    const { identifyUser } = useSegmentAnalytics()
    const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
    const [disableScrollDuringAnimation, setDisableScrollDuringAnimation] = useState(false)

    const [showSendDialog, setShowSendDialog] = useState(false)
    const { urls: memberAvatarUrls } = getMemberAvatar(activeMembership)
    const selectedChannel = activeMembership?.channels.find((chanel) => chanel.id === channelId)

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

    const transition = useTransition(isList, {
      from: { opacity: 0, x: isList ? 280 : -280, position: 'absolute' as const },
      enter: { opacity: 1, x: 0 },
      leave: { opacity: 0, x: isList ? -280 : 280 },
      config: {
        duration: parseInt(cVar('animationTimingMedium', true)),
        // 'animationEasingMedium'
        easing: bezier(0.03, 0.5, 0.25, 1),
      },
      onStart: () => setDisableScrollDuringAnimation(true),
      onRest: () => setDisableScrollDuringAnimation(false),
    })

    const handleAddNewMember = useCallback(() => {
      closeDropdown?.()
      setSignInModalOpen(true)
    }, [closeDropdown, setSignInModalOpen])

    const handleMemberChange = useCallback(
      (memberId: string, accountId: string, channelId: string | null) => {
        setActiveUser({ accountId, memberId, channelId })
        identifyUser(memberId)
        setIsList(false)

        if (publisher) {
          navigate(absoluteRoutes.studio.index())
        }
      },
      [identifyUser, navigate, publisher, setActiveUser]
    )

    const handleAddNewChannel = useCallback(() => {
      setDropdownType('channel')
      setIsList(false)
      closeDropdown?.()
    }, [closeDropdown])

    const handleChannelChange = useCallback(
      (channelId: string) => {
        setDropdownType('channel')
        setIsList(false)
        setActiveUser({ channelId })
        onChannelChange?.(channelId)
      },
      [onChannelChange, setActiveUser]
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
      if (isActive) {
        return
      }
      setIsList(false)
      setDropdownType(publisher ? 'channel' : 'member')
    }, [isActive, publisher])

    return (
      <>
        <WithdrawFundsDialog
          avatarUrls={memberAvatarUrls}
          activeMembership={activeMembership}
          show={showWithdrawDialog}
          onExitClick={toggleWithdrawDialog}
          totalBalance={totalBalance}
          channelBalance={channelBalance}
          channelId={channelId}
        />
        <SendFundsDialog show={showSendDialog} onExitClick={toggleSendDialog} accountBalance={accountBalance} />
        <Container ref={mergeRefs([ref, containerRef])}>
          <InnerContainer
            onTransitionEnd={resetToDefaultState}
            isActive={isActive}
            containerHeight={measureContainerHeight}
            disableVerticalScroll={disableScrollDuringAnimation}
          >
            {transition((style, isList) => (
              <SlideAnimationContainer style={style} disableVerticalScroll={disableScrollDuringAnimation}>
                {!isList ? (
                  <div ref={measureContainerRef}>
                    <MemberDropdownNav
                      containerRefElement={containerRef.current}
                      channelId={channelId}
                      onSignOut={signOut}
                      onShowFundsDialog={() =>
                        dropdownType === 'channel' ? setShowWithdrawDialog(true) : setShowSendDialog(true)
                      }
                      accountBalance={accountBalance}
                      channelBalance={channelBalance}
                      lockedAccountBalance={lockedAccountBalance}
                      activeMembership={activeMembership}
                      membershipLoading={membershipsLoading}
                      hasOneMember={hasOneMember}
                      onSwitchDropdownType={setDropdownType}
                      onSwitchToList={(type) => handleSwitch(type, true)}
                      onCloseDropdown={closeDropdown}
                      publisher={publisher}
                      type={dropdownType}
                      isInDebt={totalBalance && totalInvitationLock && totalBalance?.sub(totalInvitationLock).isNeg()}
                    />
                  </div>
                ) : (
                  <div ref={measureContainerRef}>
                    <MemberDropdownList
                      channelId={channelId}
                      memberships={memberships}
                      activeMembership={activeMembership}
                      onMemberChange={handleMemberChange}
                      onChannelChange={handleChannelChange}
                      onAddNewChannel={handleAddNewChannel}
                      onAddNewMember={handleAddNewMember}
                      onSwitchToNav={(type) => handleSwitch(type, false)}
                      type={dropdownType}
                    />
                  </div>
                )}
              </SlideAnimationContainer>
            ))}
          </InnerContainer>
        </Container>
      </>
    )
  }
)
MemberDropdown.displayName = 'MemberDropdown'
