import bezier from 'bezier-easing'
import BN from 'bn.js'
import { FC, useRef } from 'react'
import { useNavigate } from 'react-router'
import { animated, useTransition } from 'react-spring'
import useResizeObserver from 'use-resize-observer'

import { FullMembershipFieldsFragment } from '@/api/queries'
import { ListItem, ListItemProps } from '@/components/ListItem'
import { NumberFormat } from '@/components/NumberFormat'
import { Tooltip } from '@/components/Tooltip'
import {
  SvgActionAddVideo,
  SvgActionChannel,
  SvgActionChevronR,
  SvgActionLogOut,
  SvgActionMember,
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
import { useAsset, useMemberAvatar } from '@/providers/assets'
import { useUserStore } from '@/providers/user'
import { cVar } from '@/styles'

import { BalanceTooltip } from './BalanceTooltip'
import { SectionContainer } from './MemberDropdown.styles'
import {
  AddAvatar,
  AnimatedSectionContainer,
  AnimatedTextLink,
  AvatarWrapper,
  AvatarsGroupContainer,
  BalanceContainer,
  BlurredBG,
  Divider,
  Filter,
  FixedSizeContainer,
  MemberHandleText,
  MemberInfoContainer,
  StyledAvatar,
  StyledIconWrapper,
  TextLink,
  UserBalance,
} from './MemberDropdownNav.styles'

type DropdownType = 'member' | 'channel'

type MemberDropdownNavProps = {
  type: 'member' | 'channel'
  publisher?: boolean
  containerRefElement: Element | null
  onCloseDropdown?: () => void
  onSwitchDropdownType: (type: DropdownType) => void
  onSwitchToList: (type: DropdownType) => void
  onSignOut: () => void
  onShowFundsDialog: () => void
  activeMembership?: FullMembershipFieldsFragment | null
  hasOneMember?: boolean
  channelId: string | null
  accountBalance?: BN
  channelBalance?: BN
  lockedAccountBalance?: BN
}

export const MemberDropdownNav: FC<MemberDropdownNavProps> = ({
  type,
  publisher,
  containerRefElement,
  onCloseDropdown,
  onSwitchDropdownType,
  onSwitchToList,
  onSignOut,
  onShowFundsDialog,
  channelId,
  activeMembership,
  hasOneMember,
  accountBalance,
  lockedAccountBalance,
  channelBalance,
}) => {
  const navigate = useNavigate()
  const selectedChannel = activeMembership?.channels.find((chanel) => chanel.id === channelId)
  const { url: memberAvatarUrl, isLoadingAsset: memberAvatarLoading } = useMemberAvatar(activeMembership)
  const { url: channelAvatarUrl, isLoadingAsset: isChannelAvatarLoading } = useAsset(selectedChannel?.avatarPhoto)
  const setSignInModalOpen = useUserStore((state) => state.actions.setSignInModalOpen)

  const { ref: textLinkRef, width: textLinkWidth } = useResizeObserver<HTMLDivElement>({
    box: 'border-box',
  })
  const { ref: memberContainerRef, height: memberContainerHeight } = useResizeObserver<HTMLDivElement>({
    box: 'border-box',
  })
  const { ref: sectionContainerRef, height: sectionContainerHeight } = useResizeObserver<HTMLDivElement>({
    box: 'border-box',
  })
  const blockAnimationRef = useRef<HTMLDivElement>(null)

  const memberChanneltransition = useTransition(type, {
    from: { opacity: 0, x: type === 'channel' ? 280 : -280, position: 'absolute' as const },
    enter: { opacity: 1, x: 0 },
    leave: { opacity: 0, x: type === 'channel' ? -280 : 280 },

    // this will block initial animation when switching to list
    immediate: !blockAnimationRef.current,
    config: {
      duration: parseInt(cVar('animationTimingMedium', true)),
      // 'animationEasingMedium'
      easing: bezier(0.03, 0.5, 0.25, 1),
    },
  })

  const hasAtLeastOneChannel = activeMembership?.channels.length && activeMembership?.channels.length >= 1

  const handleAddNewMember = () => {
    setSignInModalOpen(true)
    onCloseDropdown?.()
  }
  return (
    <div ref={blockAnimationRef}>
      <BlurredBG memberUrl={memberAvatarUrl} channelUrl={channelAvatarUrl} isChannel={type === 'channel'}>
        <Filter />
        <MemberInfoContainer>
          <AvatarsGroupContainer>
            <Tooltip text="Member" offsetY={16} placement="bottom">
              <AvatarWrapper>
                <StyledAvatar
                  disabledInteractiveStyles
                  clickable={false}
                  onClick={() => onSwitchDropdownType('member')}
                  isDisabled={type === 'channel'}
                  size="small"
                  assetUrl={memberAvatarUrl}
                  loading={memberAvatarLoading}
                />
                <StyledIconWrapper size="small" icon={<SvgActionMember />} />
              </AvatarWrapper>
            </Tooltip>
            <Tooltip text={hasAtLeastOneChannel ? 'Channel' : 'Create channel'} offsetY={16} placement="bottom">
              <AvatarWrapper>
                <StyledAvatar
                  disabledInteractiveStyles
                  onClick={() =>
                    hasAtLeastOneChannel
                      ? onSwitchDropdownType('channel')
                      : navigate(absoluteRoutes.studio.newChannel())
                  }
                  isDisabled={type === 'member'}
                  size="small"
                  assetUrl={channelAvatarUrl}
                  loading={isChannelAvatarLoading}
                >
                  {!hasAtLeastOneChannel ? (
                    <AddAvatar>
                      <SvgActionPlus />
                    </AddAvatar>
                  ) : null}
                </StyledAvatar>
                <StyledIconWrapper icon={<SvgActionChannel />} size="small" />
              </AvatarWrapper>
            </Tooltip>
          </AvatarsGroupContainer>
          <FixedSizeContainer height={memberContainerHeight}>
            {memberChanneltransition((style, type) => (
              <animated.div style={style} ref={memberContainerRef}>
                {type === 'channel' ? (
                  <div>
                    <MemberHandleText as="span" variant="h400">
                      {selectedChannel?.title}
                    </MemberHandleText>
                    {channelBalance !== undefined ? (
                      <UserBalance>
                        <JoyTokenIcon size={16} variant="regular" />
                        <NumberFormat as="span" variant="t200-strong" value={channelBalance} format="short" />
                      </UserBalance>
                    ) : (
                      <SkeletonLoader width={30} height={20} />
                    )}
                  </div>
                ) : (
                  <div>
                    <MemberHandleText as="span" variant="h400">
                      {activeMembership?.handle}
                    </MemberHandleText>
                    <BalanceTooltip
                      containerRefElement={containerRefElement}
                      accountBalance={accountBalance}
                      lockedAccountBalance={lockedAccountBalance}
                    >
                      {accountBalance !== undefined ? (
                        <UserBalance>
                          <JoyTokenIcon size={16} variant="regular" withoutInformationTooltip />
                          <NumberFormat as="span" variant="t200-strong" value={accountBalance} format="short" />
                        </UserBalance>
                      ) : (
                        <SkeletonLoader width={30} height={20} />
                      )}
                    </BalanceTooltip>
                  </div>
                )}
              </animated.div>
            ))}
          </FixedSizeContainer>
          <BalanceContainer>
            <FixedSizeContainer width={textLinkWidth} height="100%">
              {memberChanneltransition(({ opacity, position }) => (
                <AnimatedTextLink
                  ref={textLinkRef}
                  as="span"
                  style={{ opacity, position }}
                  onClick={() => {
                    onCloseDropdown?.()
                    onShowFundsDialog()
                  }}
                  variant="t100"
                  color="colorCoreNeutral200Lighten"
                >
                  {type === 'channel' ? 'Withdraw' : 'Transfer'}
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
        </MemberInfoContainer>
      </BlurredBG>
      <FixedSizeContainer height={sectionContainerHeight}>
        {memberChanneltransition((style, item) => (
          <AnimatedSectionContainer ref={sectionContainerRef} style={style}>
            {item === 'member' ? (
              <ListItemOptions
                publisher={publisher}
                closeDropdown={onCloseDropdown}
                listItems={[
                  {
                    asButton: true,
                    label: 'My profile',
                    onClick: onCloseDropdown,
                    nodeStart: <IconWrapper icon={<SvgActionMember />} />,
                    to: absoluteRoutes.viewer.member(activeMembership?.handle),
                  },
                  {
                    asButton: true,
                    label: hasOneMember ? 'Add new member...' : 'Switch member',
                    nodeStart: <IconWrapper icon={hasOneMember ? <SvgActionPlus /> : <SvgActionSwitchMember />} />,
                    nodeEnd: !hasOneMember && <SvgActionChevronR />,
                    onClick: () => (hasOneMember ? handleAddNewMember() : onSwitchToList(type)),
                  },
                ]}
              />
            ) : (
              <ListItemOptions
                publisher={publisher}
                closeDropdown={onCloseDropdown}
                listItems={[
                  {
                    asButton: true,
                    label: 'My channel',
                    onClick: onCloseDropdown,
                    nodeStart: <IconWrapper icon={<SvgActionChannel />} />,
                    to: hasAtLeastOneChannel
                      ? absoluteRoutes.viewer.channel(channelId ?? undefined)
                      : absoluteRoutes.studio.signIn(),
                  },
                  {
                    asButton: true,
                    label: 'Switch channel',
                    nodeStart: <IconWrapper icon={<SvgActionSwitchMember />} />,
                    nodeEnd: <SvgActionChevronR />,
                    onClick: () => onSwitchToList(type),
                  },
                ]}
              />
            )}
          </AnimatedSectionContainer>
        ))}
      </FixedSizeContainer>
      <SectionContainer>
        <ListItem
          label="Disconnect wallet"
          destructive
          nodeStart={<IconWrapper destructive icon={<SvgActionLogOut />} />}
          onClick={() => {
            onCloseDropdown?.()
            onSignOut()
          }}
        />
      </SectionContainer>
    </div>
  )
}

type ListItemOptionsProps = {
  publisher?: boolean
  closeDropdown?: () => void
  listItems: [ListItemProps, ListItemProps]
}
const ListItemOptions: FC<ListItemOptionsProps> = ({ publisher, closeDropdown, listItems }) => {
  return (
    <>
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
      {listItems.map((listItemsProps, idx) => (
        <ListItem key={idx} {...listItemsProps} />
      ))}
    </>
  )
}
