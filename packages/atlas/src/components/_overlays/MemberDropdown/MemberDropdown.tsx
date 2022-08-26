import { BN } from 'bn.js'
import { FC, forwardRef, useEffect, useRef, useState } from 'react'
import mergeRefs from 'react-merge-refs'
import { useLocation, useNavigate } from 'react-router'
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
  BalanceContainer,
  BlurredBG,
  ChannelsSectionTitle,
  Container,
  DROPDOWN_ANIMATION,
  Divider,
  Filter,
  InnerContainer,
  MemberHandleText,
  MemberInfoContainer,
  SectionContainer,
  SlideAnimationContainer,
  StyledAvatar,
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
    const containerRef = useRef<HTMLDivElement>(null)

    const [dropdownType, setDropDownType] = useState<'member' | 'channel' | 'list'>('member')

    const hasOneMember = memberships?.length === 1

    const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
    const [showSendDialog, setShowSendDialog] = useState(false)
    const { accountBalance } = useSubscribeAccountBalance()
    const selectedChannel = activeMembership?.channels.find((chanel) => chanel.id === channelId)
    const { accountBalance: channelBalance } = useSubscribeAccountBalance(selectedChannel?.rewardAccount) || new BN(0)

    const { url: avatarUrl, isLoadingAsset: avatarLoading } = useMemberAvatar(activeMembership)
    const { url: channelAvatarUrl, isLoadingAsset: isChannelAvatarLoading } = useAsset(selectedChannel?.avatarPhoto)
    const toggleWithdrawDialog = () => setShowWithdrawDialog((prevState) => !prevState)
    const toggleSendDialog = () => setShowSendDialog((prevState) => !prevState)
    const setSignInModalOpen = useUserStore((state) => state.actions.setSignInModalOpen)

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

    return (
      <>
        <WithdrawFundsDialog
          avatarUrl={avatarUrl}
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
              key={dropdownType}
              timeout={parseInt(cVar('animationTransitionFast', true))}
              classNames={DROPDOWN_ANIMATION}
            >
              <InnerContainer
                isActive={isActive}
                containerHeight={containerHeight}
                slideDirection={dropdownType === 'list' ? 'left' : 'right'}
              >
                {dropdownType === 'member' && (
                  <SlideAnimationContainer>
                    <div ref={mergeRefs([measureContainerRef, containerRef])}>
                      <BlurredBG url={avatarUrl}>
                        <Filter />
                        <MemberInfoContainer>
                          <StyledAvatar
                            size="fill"
                            assetUrl={dropdownType === 'member' ? avatarUrl : channelAvatarUrl}
                            loading={dropdownType === 'member' ? avatarLoading : isChannelAvatarLoading}
                          />
                          <div>
                            {/* Using invisible unicode character ZERO WIDTH NON-JOINER (U+200C) to preserve the space while member handle loads */}
                            <MemberHandleText as="span" variant="h400">
                              {publisher ? selectedChannel?.title : activeMembership?.handle ?? '‌‌ '}
                            </MemberHandleText>
                            {accountBalance !== undefined ? (
                              <>
                                <UserBalance>
                                  <JoyTokenIcon size={16} variant="regular" />
                                  <NumberFormat as="span" variant="t200-strong" value={accountBalance} format="short" />
                                </UserBalance>
                              </>
                            ) : (
                              <SkeletonLoader width={30} height={20} />
                            )}
                            <BalanceContainer>
                              <TextLink
                                as="span"
                                onClick={() => {
                                  closeDropdown?.()
                                  publisher ? setShowWithdrawDialog(true) : setShowSendDialog(true)
                                }}
                                variant="t100"
                                color="colorCoreNeutral200Lighten"
                              >
                                {publisher ? 'Withdraw' : 'Transfer'}
                              </TextLink>
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
                      <SectionContainer>
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
                            <ListItem
                              onClick={closeDropdown}
                              nodeStart={<IconWrapper icon={<SvgActionMember />} />}
                              label="My profile"
                              to={absoluteRoutes.viewer.member(activeMembership?.handle)}
                            />
                          </>
                        )}
                        <ListItem
                          asButton
                          onClick={closeDropdown}
                          nodeStart={<IconWrapper icon={<SvgActionChannel />} />}
                          caption={selectedChannel?.title}
                          label="My channel"
                          to={
                            activeMembership?.channels.length
                              ? absoluteRoutes.viewer.channel(channelId ?? undefined)
                              : absoluteRoutes.studio.signIn()
                          }
                        />
                        <ListItem
                          nodeStart={
                            <IconWrapper icon={hasOneMember ? <SvgActionPlus /> : <SvgActionSwitchMember />} />
                          }
                          onClick={() => (hasOneMember ? handleAddNewMember() : setDropDownType('list'))}
                          label={hasOneMember ? 'Add new member...' : 'Switch member'}
                          nodeEnd={!hasOneMember && <SvgActionChevronR />}
                        />
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
                      {publisher && (
                        <SectionContainer>
                          <ChannelsSectionTitle as="span" variant="t100" color="colorText">
                            Use Joystream as
                          </ChannelsSectionTitle>
                          {activeMembership?.channels.map((channel) => (
                            <ChannelListItem
                              key={channel.id}
                              channel={channel}
                              selected={channel.id === channelId}
                              onClick={() => onChannelChange?.(channel.id)}
                            />
                          ))}
                          <ListItem
                            onClick={closeDropdown}
                            nodeStart={<IconWrapper icon={<SvgActionPlus />} />}
                            label="Add new channel..."
                            to={absoluteRoutes.studio.newChannel()}
                          />
                        </SectionContainer>
                      )}
                    </div>
                  </SlideAnimationContainer>
                )}
                {dropdownType === 'list' && (
                  <SlideAnimationContainer>
                    <div ref={mergeRefs([measureContainerRef, containerRef])}>
                      <SwitchMemberItemListContainer>
                        <ListItem
                          onClick={() => setDropDownType('member')}
                          nodeStart={<SvgActionChevronL />}
                          label="Switch member"
                        />
                      </SwitchMemberItemListContainer>
                      <SectionContainer>
                        {memberships?.map((member) => (
                          <MemberListItem
                            key={member.id}
                            member={member}
                            selected={member.id === activeMembership?.id}
                            onClick={() =>
                              handleMemberChange(member.id, member.controllerAccount, member.channels[0]?.id || null)
                            }
                          />
                        ))}
                        <ListItem
                          nodeStart={<IconWrapper icon={<SvgActionNewChannel />} />}
                          onClick={handleAddNewMember}
                          label="Add new member..."
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
