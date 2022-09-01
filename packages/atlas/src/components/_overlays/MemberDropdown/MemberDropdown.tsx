import bezier from 'bezier-easing'
import { BN } from 'bn.js'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import mergeRefs from 'react-merge-refs'
import { useNavigate } from 'react-router'
import { useTransition } from 'react-spring'
import useResizeObserver from 'use-resize-observer'

import { absoluteRoutes } from '@/config/routes'
import { useMemberAvatar } from '@/providers/assets'
import { useSubscribeAccountBalance } from '@/providers/joystream'
import { useUser } from '@/providers/user'
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
    const { channelId, activeMembership, memberships, signOut, setActiveUser, setSignInModalOpen } = useUser()
    const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
    const [disableScrollDuringAnimation, setDisableScrollDuringAnimation] = useState(false)

    const [showSendDialog, setShowSendDialog] = useState(false)
    const { url: memberAvatarUrl } = useMemberAvatar(activeMembership)
    const selectedChannel = activeMembership?.channels.find((chanel) => chanel.id === channelId)

    const { accountBalance, lockedAccountBalance } = useSubscribeAccountBalance()
    const { accountBalance: channelBalance } = useSubscribeAccountBalance(selectedChannel?.rewardAccount) || new BN(0)

    const hasOneMember = memberships?.length === 1

    const [dropdownType, setDropdownType] = useState<'channel' | 'member'>('member')
    const [isList, setIsList] = useState(false)
    const { ref: measureContainerRef, height: measureContainerHeight } = useResizeObserver<HTMLDivElement>({
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
      onDestroyed: () => setDisableScrollDuringAnimation(false),
    })

    const handleAddNewMember = useCallback(() => {
      closeDropdown?.()
      setSignInModalOpen(true)
    }, [closeDropdown, setSignInModalOpen])

    const handleMemberChange = useCallback(
      (memberId: string, accountId: string, channelId: string | null) => {
        setActiveUser({ accountId, memberId, channelId })
        setIsList(false)

        if (publisher) {
          navigate(absoluteRoutes.studio.index())
        }
      },
      [navigate, publisher, setActiveUser]
    )

    const handleChannelChange = useCallback(
      (channelId: string) => {
        setDropdownType('channel')
        setIsList(false)
        onChannelChange?.(channelId)
      },
      [onChannelChange]
    )

    const handleSwitch = useCallback((type: 'channel' | 'member', changeToList: boolean) => {
      setDropdownType(type)
      setIsList(changeToList)
    }, [])

    const toggleWithdrawDialog = () => setShowWithdrawDialog((prevState) => !prevState)
    const toggleSendDialog = () => setShowSendDialog((prevState) => !prevState)

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

    return (
      <>
        <WithdrawFundsDialog
          avatarUrl={memberAvatarUrl}
          activeMembership={activeMembership}
          show={showWithdrawDialog}
          onExitClick={toggleWithdrawDialog}
          accountBalance={accountBalance}
          channelBalance={channelBalance}
          channelId={channelId}
        />
        <SendFundsDialog show={showSendDialog} onExitClick={toggleSendDialog} accountBalance={accountBalance} />
        <Container ref={mergeRefs([ref, containerRef])}>
          <InnerContainer isActive={isActive} containerHeight={measureContainerHeight}>
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
                      hasOneMember={hasOneMember}
                      onSwitchDropdownType={setDropdownType}
                      onSwitchToList={(type) => handleSwitch(type, true)}
                      onCloseDropdown={closeDropdown}
                      publisher={publisher}
                      type={dropdownType}
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
                      onCloseDropdown={closeDropdown}
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
