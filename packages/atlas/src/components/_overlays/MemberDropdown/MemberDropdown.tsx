import { easings, useSpringRef, useTransition } from '@react-spring/web'
import { FC, forwardRef, useEffect, useRef, useState } from 'react'
import mergeRefs from 'react-merge-refs'
import { useLocation, useNavigate } from 'react-router'
import useResizeObserver from 'use-resize-observer'

import { BasicChannelFieldsFragment, BasicMembershipFieldsFragment } from '@/api/queries'
import { Avatar } from '@/components/Avatar'
import { ListItem } from '@/components/ListItem'
import { NumberFormat } from '@/components/NumberFormat'
import {
  SvgActionAddVideo,
  SvgActionChevronL,
  SvgActionChevronR,
  SvgActionLogOut,
  SvgActionMember,
  SvgActionNewChannel,
  SvgActionPlay,
  SvgActionPlus,
} from '@/components/_icons'
import { SvgActionSwitchMember } from '@/components/_icons/ActionSwitchMember'
import { IconWrapper } from '@/components/_icons/IconWrapper'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { JOY_CURRENCY_TICKER } from '@/config/token'
import { useSubscribeAccountBalance } from '@/hooks/useSubscribeAccountBalance'
import { useAsset, useMemberAvatar } from '@/providers/assets'
import { useUser, useUserStore } from '@/providers/user'

import {
  AnimatedContainer,
  BalanceContainer,
  BlurredBG,
  ChannelsSectionTitle,
  Container,
  Divider,
  Filter,
  InnerContainer,
  LearnAboutLink,
  MemberHandleText,
  MemberInfoContainer,
  SectionContainer,
  StyledAvatar,
  SwitchMemberItemListContainer,
  UserBalance,
} from './MemberDropdown.styles'

export type MemberDropdownProps = {
  isActive: boolean
  publisher?: boolean
  closeDropdown?: () => void
  onChannelChange?: (channelId: string) => void
}

export const MemberDropdown = forwardRef<HTMLDivElement, MemberDropdownProps>(
  ({ publisher, isActive, closeDropdown, onChannelChange }, ref) => {
    const { pathname } = useLocation()

    const [isSwitchingMember, setIsSwitchingMember] = useState(false)
    const [isAnimatingSwitchMember] = useState(false)
    const navigate = useNavigate()
    const { channelId, activeMembership, setActiveUser, memberships, signOut } = useUser()
    const setSignInModalOpen = useUserStore((state) => state.actions.setSignInModalOpen)
    const accountBalance = useSubscribeAccountBalance()
    const containerRef = useRef<HTMLDivElement>(null)
    const { ref: measureContainerRef, height: containerHeight = 0 } = useResizeObserver({ box: 'border-box' })
    const transRef = useSpringRef()
    const transitions = useTransition(isSwitchingMember, {
      ref: transRef,
      key: null,
      from: { opacity: 0, x: 280 * (isSwitchingMember ? 1 : -1) },
      enter: { opacity: 1, x: 0 },
      leave: { opacity: 0, x: -280 * (isSwitchingMember ? 1 : -1) },
      config: {
        duration: 250,
        easing: easings.easeOutCirc,
      },
    })

    const { url: avatarUrl, isLoadingAsset: avatarLoading } = useMemberAvatar(activeMembership)

    const isStudio = pathname.search(absoluteRoutes.studio.index()) !== -1
    const hasOneMember = memberships?.length === 1

    const handleAddNewChannel = () => {
      navigate(absoluteRoutes.studio.newChannel())
      closeDropdown?.()
    }
    const handleGoToJoystream = () => {
      navigate(absoluteRoutes.viewer.index())
      closeDropdown?.()
    }
    const handleGoToStudio = () => {
      navigate(absoluteRoutes.studio.index())
      closeDropdown?.()
    }
    const handleGoToMyProfile = () => {
      navigate(absoluteRoutes.viewer.member(activeMembership?.handle))
      closeDropdown?.()
    }
    const handleAddNewMember = () => {
      setSignInModalOpen(true)
      closeDropdown?.()
      setIsSwitchingMember(false)
    }
    const handleMemberChange = (memberId: string, accountId: string, channelId: string | null) => {
      setActiveUser({ accountId, memberId, channelId })

      closeDropdown?.()
      setIsSwitchingMember(false)

      if (isStudio) {
        navigate(absoluteRoutes.studio.index())
      }
    }

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
          setIsSwitchingMember(false)
          closeDropdown?.()
        }
      }
      document.addEventListener('click', handleClickOutside, true)
      return () => {
        document.removeEventListener('click', handleClickOutside, true)
      }
    }, [closeDropdown, isActive])

    useEffect(() => {
      transRef.start()
    }, [isSwitchingMember, transRef])
    return (
      <Container ref={ref}>
        <InnerContainer isActive={isActive} containerHeight={containerHeight}>
          {transitions((style, isSwitchingMemberMode) =>
            isSwitchingMemberMode ? (
              <AnimatedContainer isAnimatingSwitchMember={isAnimatingSwitchMember} style={style}>
                <div ref={mergeRefs([containerRef, measureContainerRef])}>
                  <SwitchMemberItemListContainer>
                    <ListItem
                      onClick={() => setIsSwitchingMember(false)}
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
              </AnimatedContainer>
            ) : (
              <AnimatedContainer isAnimatingSwitchMember={isAnimatingSwitchMember} style={style}>
                <div ref={mergeRefs([containerRef, measureContainerRef])}>
                  <BlurredBG url={avatarUrl}>
                    <Filter />
                    <MemberInfoContainer>
                      <StyledAvatar size="fill" assetUrl={avatarUrl} loading={avatarLoading} />
                      <div>
                        {/* Using invisible unicode character ZERO WIDTH NON-JOINER (U+200C) to preserve the space while member handle loads */}
                        <MemberHandleText as="span" variant="h400">
                          {activeMembership?.handle ?? '‌‌ '}
                        </MemberHandleText>
                        <BalanceContainer>
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
                          <Divider />
                          <LearnAboutLink
                            variant="t100"
                            as="a"
                            // @ts-ignore our types don't allow this but its fine here
                            href="https://www.joystream.org/token"
                            target="_blank"
                            rel="noopener noreferrer"
                            color="colorCoreNeutral200Lighten"
                          >
                            Learn about ${JOY_CURRENCY_TICKER}
                          </LearnAboutLink>
                        </BalanceContainer>
                      </div>
                    </MemberInfoContainer>
                  </BlurredBG>
                  <SectionContainer>
                    {publisher ? (
                      <ListItem
                        onClick={handleGoToJoystream}
                        nodeStart={<IconWrapper icon={<SvgActionPlay />} />}
                        label="Go to Joystream"
                      />
                    ) : (
                      <>
                        <ListItem
                          onClick={handleGoToStudio}
                          nodeStart={<IconWrapper icon={<SvgActionAddVideo />} />}
                          label="Go to Studio"
                        />
                        <ListItem
                          onClick={handleGoToMyProfile}
                          nodeStart={<IconWrapper icon={<SvgActionMember />} />}
                          label="My profile"
                        />
                      </>
                    )}
                  </SectionContainer>
                  {publisher && (
                    <SectionContainer>
                      <ChannelsSectionTitle as="span" variant="t100" color="colorText">
                        Your channels
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
                        onClick={handleAddNewChannel}
                        nodeStart={<IconWrapper icon={<SvgActionPlus />} />}
                        label="Add new channel..."
                      />
                    </SectionContainer>
                  )}
                  <SectionContainer>
                    <ListItem
                      nodeStart={<IconWrapper icon={hasOneMember ? <SvgActionPlus /> : <SvgActionSwitchMember />} />}
                      onClick={() => (hasOneMember ? handleAddNewMember() : setIsSwitchingMember(true))}
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
                </div>
              </AnimatedContainer>
            )
          )}
        </InnerContainer>
      </Container>
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
    />
  )
}
