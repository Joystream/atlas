import { BN } from 'bn.js'
import { FC, forwardRef, useEffect, useRef, useState } from 'react'
import mergeRefs from 'react-merge-refs'
import { useLocation, useNavigate } from 'react-router'
import { animated, useTransition } from 'react-spring'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import useResizeObserver from 'use-resize-observer'

import {
  BasicChannelFieldsFragment,
  BasicMembershipFieldsFragment,
} from '@/api/queries/__generated__/fragments.generated'
import { Avatar } from '@/components/Avatar'
import { ListItem } from '@/components/ListItem'
import { NumberFormat } from '@/components/NumberFormat'
import {
  SvgActionAddVideo,
  SvgActionChannel,
  SvgActionChevronL,
  SvgActionChevronR,
  SvgActionLogOut,
  SvgActionMember,
  SvgActionNewChannel,
  SvgActionNewTab,
  SvgActionPlay,
  SvgActionPlus,
  SvgActionSwitchMember,
} from '@/components/_icons'
import { IconWrapper } from '@/components/_icons/IconWrapper'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { JOY_CURRENCY_TICKER } from '@/config/joystream'
import { absoluteRoutes } from '@/config/routes'
import { useAsset, useMemberAvatar } from '@/providers/assets/assets.hooks'
import { useSubscribeAccountBalance } from '@/providers/joystream/joystream.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { useUserStore } from '@/providers/user/user.store'
import { cVar } from '@/styles'

import {
  AnimatedSectionContainer,
  AnimatedTextLink,
  AvatarWrapper,
  AvatarsGroupContainer,
  BalanceContainer,
  BlurredBG,
  Container,
  Divider,
  Filter,
  FixedSizeContainer,
  InnerContainer,
  LIST_TRANSITION,
  MemberHandleText,
  MemberInfoContainer,
  SectionContainer,
  SlideAnimationContainer,
  StyledAvatar,
  StyledIconWrapper,
  SwitchMemberItemListContainer,
  TextLink,
  UserBalance,
} from './MemberDropdown.styles'

import { SendFundsDialog, WithdrawFundsDialog } from '../SendTransferDialogs'

export type MemberDropdownProps = {
  isActive: boolean
  publisher?: boolean
  closeDropdown?: () => void
  onChannelChange?: (channelId: string) => void
}

export const MemberDropdown = forwardRef<HTMLDivElement, MemberDropdownProps>(
  ({ publisher, isActive, closeDropdown, onChannelChange }, ref) => {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const { channelId, activeMembership, setActiveUser, memberships, signOut } = useUser()
    const { ref: measureContainerRef, height: containerHeight = 0 } = useResizeObserver<HTMLDivElement>({
      box: 'border-box',
    })
    const { ref: textLinkRef, width: textLinkWidth } = useResizeObserver<HTMLDivElement>({
      box: 'border-box',
    })
    const { ref: memberContainerRef, height: memberContainerHeight } = useResizeObserver<HTMLDivElement>({
      box: 'border-box',
    })
    const { ref: sectionContainerRef, height: sectionContainerHeight } = useResizeObserver<HTMLDivElement>({
      box: 'border-box',
    })
    const containerRef = useRef<HTMLDivElement>(null)

    const [dropdownType, setDropDownType] = useState<'member' | 'channel' | 'list-channel' | 'list-member'>('member')

    const hasOneMember = memberships?.length === 1
    const hasAtLeastOneChannel = activeMembership?.channels.length && activeMembership?.channels.length >= 1

    const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
    const [showSendDialog, setShowSendDialog] = useState(false)
    const { accountBalance } = useSubscribeAccountBalance()
    const selectedChannel = activeMembership?.channels.find((chanel) => chanel.id === channelId)
    const { accountBalance: channelBalance } = useSubscribeAccountBalance(selectedChannel?.rewardAccount) || new BN(0)

    const balance = dropdownType === 'channel' ? channelBalance : accountBalance

    const { url: memberAvatarUrl, isLoadingAsset: memberAvatarLoading } = useMemberAvatar(activeMembership)
    const { url: channelAvatarUrl, isLoadingAsset: isChannelAvatarLoading } = useAsset(selectedChannel?.avatarPhoto)
    const toggleWithdrawDialog = () => setShowWithdrawDialog((prevState) => !prevState)
    const toggleSendDialog = () => setShowSendDialog((prevState) => !prevState)
    const setSignInModalOpen = useUserStore((state) => state.actions.setSignInModalOpen)

    const transitions = useTransition(dropdownType, {
      from: { opacity: 0, x: dropdownType === 'channel' ? 280 : -280, position: 'absolute' as const },
      enter: { opacity: 1, x: 0 },
      leave: { opacity: 0, x: dropdownType === 'channel' ? -280 : 280 },
    })

    const isStudio = pathname.search(absoluteRoutes.studio.index()) !== -1
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

    const handleAddNewMember = () => {
      setSignInModalOpen(true)
      closeDropdown?.()
    }

    const handleMemberChange = (memberId: string, accountId: string, channelId: string | null) => {
      setActiveUser({ accountId, memberId, channelId })

      closeDropdown?.()

      if (isStudio) {
        navigate(absoluteRoutes.studio.index())
      }
    }

    const isList = dropdownType === 'list-channel' || dropdownType === 'list-member'

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
        <Container ref={ref}>
          <SwitchTransition>
            <CSSTransition
              key={isList ? 'list' : 'member-or-channel'}
              timeout={parseInt(cVar('animationTimingMedium', true))}
              classNames={LIST_TRANSITION}
            >
              <InnerContainer
                isActive={isActive}
                containerHeight={containerHeight}
                slideDirection={isList ? 'left' : 'right'}
              >
                {(dropdownType === 'member' || dropdownType === 'channel') && (
                  <SlideAnimationContainer>
                    <div ref={mergeRefs([measureContainerRef, containerRef])}>
                      <BlurredBG url={dropdownType === 'member' ? memberAvatarUrl : channelAvatarUrl}>
                        <Filter />
                        <MemberInfoContainer>
                          <AvatarsGroupContainer>
                            <AvatarWrapper>
                              <StyledAvatar
                                onClick={() => setDropDownType('member')}
                                isDisabled={dropdownType === 'channel'}
                                size="small"
                                assetUrl={memberAvatarUrl}
                                loading={memberAvatarLoading}
                              />
                              <StyledIconWrapper size="small" icon={<SvgActionMember width={14} height={14} />} />
                            </AvatarWrapper>
                            {!!hasAtLeastOneChannel && (
                              <AvatarWrapper>
                                <StyledAvatar
                                  onClick={() => setDropDownType('channel')}
                                  isDisabled={dropdownType === 'member'}
                                  size="small"
                                  assetUrl={channelAvatarUrl}
                                  loading={isChannelAvatarLoading}
                                />
                                <StyledIconWrapper icon={<SvgActionChannel width={14} height={14} />} size="small" />
                              </AvatarWrapper>
                            )}
                          </AvatarsGroupContainer>
                          <div>
                            <FixedSizeContainer height={memberContainerHeight}>
                              {transitions((style) => (
                                <animated.div style={style} ref={memberContainerRef}>
                                  <MemberHandleText as="span" variant="h400">
                                    {dropdownType === 'channel' ? selectedChannel?.title : activeMembership?.handle}
                                  </MemberHandleText>
                                  {balance !== undefined ? (
                                    <UserBalance>
                                      <JoyTokenIcon size={16} variant="regular" />
                                      <NumberFormat as="span" variant="t200-strong" value={balance} format="short" />
                                    </UserBalance>
                                  ) : (
                                    <SkeletonLoader width={30} height={20} />
                                  )}
                                </animated.div>
                              ))}
                            </FixedSizeContainer>
                            <BalanceContainer>
                              <FixedSizeContainer width={textLinkWidth} height="100%">
                                {transitions(({ opacity, position }) => (
                                  <AnimatedTextLink
                                    ref={textLinkRef}
                                    as="span"
                                    style={{ opacity, position }}
                                    onClick={() => {
                                      closeDropdown?.()
                                      dropdownType === 'channel' ? setShowWithdrawDialog(true) : setShowSendDialog(true)
                                    }}
                                    variant="t100"
                                    color="colorCoreNeutral200Lighten"
                                  >
                                    {dropdownType === 'channel' ? 'Withdraw' : 'Transfer'}
                                  </AnimatedTextLink>
                                ))}
                              </FixedSizeContainer>
                              <Divider />
                              <TextLink
                                variant="t100"
                                as="a"
                                // @ts-ignore our types don't allow this but its fine here
                                href="https://www.joystream.org/token"
                                target="_blank"
                                rel="noopener noreferrer"
                                color="colorCoreNeutral200Lighten"
                              >
                                Learn about {JOY_CURRENCY_TICKER} <SvgActionNewTab />
                              </TextLink>
                            </BalanceContainer>
                          </div>
                        </MemberInfoContainer>
                      </BlurredBG>
                      <FixedSizeContainer height={sectionContainerHeight}>
                        {transitions((style) => (
                          <AnimatedSectionContainer ref={sectionContainerRef} style={style}>
                            {publisher ? (
                              <ListItem
                                onClick={closeDropdown}
                                nodeStart={<IconWrapper icon={<SvgActionPlay />} />}
                                label="Atlas"
                                to={absoluteRoutes.viewer.index()}
                              />
                            ) : (
                              <>
                                <ListItem
                                  onClick={closeDropdown}
                                  nodeStart={<IconWrapper icon={<SvgActionAddVideo />} />}
                                  label="Studio"
                                  to={absoluteRoutes.studio.index()}
                                />
                              </>
                            )}
                            <ListItem
                              asButton
                              onClick={closeDropdown}
                              nodeStart={
                                <IconWrapper
                                  icon={dropdownType === 'member' ? <SvgActionMember /> : <SvgActionChannel />}
                                />
                              }
                              label={dropdownType === 'member' ? 'My profile' : 'My channel'}
                              to={
                                dropdownType === 'member'
                                  ? absoluteRoutes.viewer.member(activeMembership?.handle)
                                  : activeMembership?.channels.length
                                  ? absoluteRoutes.viewer.channel(channelId ?? undefined)
                                  : absoluteRoutes.studio.signIn()
                              }
                            />
                            <ListItem
                              nodeStart={
                                <IconWrapper icon={hasOneMember ? <SvgActionPlus /> : <SvgActionSwitchMember />} />
                              }
                              onClick={() =>
                                hasOneMember ? handleAddNewMember() : setDropDownType(`list-${dropdownType}`)
                              }
                              label={
                                dropdownType === 'channel'
                                  ? hasAtLeastOneChannel
                                    ? 'Switch channel'
                                    : 'Add new channel...'
                                  : hasOneMember
                                  ? 'Add new member...'
                                  : 'Switch member'
                              }
                              nodeEnd={!hasOneMember && <SvgActionChevronR />}
                            />
                          </AnimatedSectionContainer>
                        ))}
                      </FixedSizeContainer>
                      <SectionContainer>
                        <ListItem
                          label="Disconnect wallet"
                          destructive
                          nodeStart={<IconWrapper destructive icon={<SvgActionLogOut />} />}
                          onClick={() => {
                            closeDropdown?.()
                            signOut()
                          }}
                        />
                      </SectionContainer>
                    </div>
                  </SlideAnimationContainer>
                )}
                {isList && (
                  <SlideAnimationContainer>
                    <div ref={mergeRefs([measureContainerRef, containerRef])}>
                      <SwitchMemberItemListContainer>
                        <ListItem
                          onClick={() => setDropDownType(dropdownType === 'list-channel' ? 'channel' : 'member')}
                          nodeStart={<SvgActionChevronL />}
                          label={dropdownType === 'list-channel' ? 'Switch channel' : 'Switch member'}
                        />
                      </SwitchMemberItemListContainer>
                      <SectionContainer>
                        {dropdownType === 'list-member'
                          ? memberships?.map((member) => (
                              <MemberListItem
                                key={member.id}
                                member={member}
                                selected={member.id === activeMembership?.id}
                                onClick={() =>
                                  handleMemberChange(
                                    member.id,
                                    member.controllerAccount,
                                    member.channels[0]?.id || null
                                  )
                                }
                              />
                            ))
                          : activeMembership?.channels.map((channel) => (
                              <ChannelListItem
                                key={channel.id}
                                channel={channel}
                                selected={channel.id === channelId}
                                onClick={() => onChannelChange?.(channel.id)}
                              />
                            ))}
                        <ListItem
                          nodeStart={
                            dropdownType === 'list-member' ? (
                              <IconWrapper icon={<SvgActionNewChannel />} />
                            ) : (
                              <IconWrapper icon={<SvgActionChannel />} />
                            )
                          }
                          onClick={() => (dropdownType === 'list-member' ? handleAddNewMember() : closeDropdown?.())}
                          label={dropdownType === 'list-member' ? 'Add new member...' : 'Add new channel...'}
                          to={dropdownType === 'list-channel' ? absoluteRoutes.studio.newChannel() : undefined}
                        />
                      </SectionContainer>
                    </div>
                  </SlideAnimationContainer>
                )}
              </InnerContainer>
            </CSSTransition>
          </SwitchTransition>
        </Container>
      </>
    )
  }
)
MemberDropdown.displayName = 'MemberDropdown'

type ChannelListItemProps = {
  channel: BasicChannelFieldsFragment
  selected: boolean
  onClick: () => void
}
const ChannelListItem: FC<ChannelListItemProps> = ({ channel, selected, onClick }) => {
  const { url, isLoadingAsset } = useAsset(channel?.avatarPhoto)
  return (
    <ListItem
      onClick={onClick}
      nodeStart={<Avatar assetUrl={url} loading={isLoadingAsset} />}
      label={channel?.title ?? ''}
      caption={channel ? `${channel?.follows} followers` : undefined}
      selected={selected}
    />
  )
}

type MemberListItemProps = {
  member: BasicMembershipFieldsFragment
  selected: boolean
  onClick: () => void
}
const MemberListItem: FC<MemberListItemProps> = ({ member, selected, onClick }) => {
  const { url, isLoadingAsset } = useMemberAvatar(member)
  return (
    <ListItem
      onClick={onClick}
      nodeStart={<Avatar assetUrl={url} loading={isLoadingAsset} />}
      label={member.handle ?? ''}
      selected={selected}
      asButton
    />
  )
}
