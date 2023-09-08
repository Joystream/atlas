import BN from 'bn.js'
import { FC, useRef } from 'react'
import { useNavigate } from 'react-router'
import useResizeObserver from 'use-resize-observer'

import { FullMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import {
  SvgActionAddChannel,
  SvgActionAddVideo,
  SvgActionChannel,
  SvgActionChevronR,
  SvgActionLogOut,
  SvgActionMember,
  SvgActionMoney,
  SvgActionNewTab,
  SvgActionPlay,
  SvgActionShow,
} from '@/assets/icons'
import { IconWrapper } from '@/components/IconWrapper'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { ListItem, ListItemProps } from '@/components/ListItem'
import { NumberFormat } from '@/components/NumberFormat'
import { CopyAddressButton } from '@/components/_buttons/CopyAddressButton/CopyAddressButton'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { UseNotifications } from '@/providers/notifications/notifications.hooks'

import { BalanceTooltip } from './BalanceTooltip'
import { SectionContainer } from './MemberDropdown.styles'
import {
  AddressContainer,
  AnimatedSectionContainer,
  AvatarContainer,
  Badge,
  BalanceContainer,
  BlurredBG,
  Divider,
  Filter,
  FixedSizeContainer,
  MemberHandleText,
  MemberInfoAndBgWrapper,
  MemberInfoContainer,
  StyledAvatar,
  TextLink,
  UserBalance,
} from './MemberDropdownNav.styles'

type DropdownType = 'member' | 'channel'

type MemberDropdownNavProps = {
  type: 'member' | 'channel'
  publisher?: boolean
  unseenNotificationsCounts?: UseNotifications['unseenNotificationsCounts']
  containerRefElement: Element | null
  onCloseDropdown?: () => void
  onAddNewChannel?: () => void
  onSwitchToList: (type: DropdownType) => void
  onSignOut: () => void
  onShowFundsDialog: () => void
  activeMembership?: FullMembershipFieldsFragment | null
  activeChannel?: FullMembershipFieldsFragment['channels'][number] | null
  hasOneMember?: boolean
  channelId: string | null
  accountBalance?: BN
  channelBalance?: BN
  lockedAccountBalance?: BN
  isInDebt?: boolean
}

export const MemberDropdownNav: FC<MemberDropdownNavProps> = ({
  type,
  publisher,
  unseenNotificationsCounts,
  containerRefElement,
  onCloseDropdown,
  onSwitchToList,
  onSignOut,
  onShowFundsDialog,
  channelId,
  activeMembership,
  accountBalance,
  onAddNewChannel,
  lockedAccountBalance,
  channelBalance,
  isInDebt,
  activeChannel,
}) => {
  const navigate = useNavigate()
  const selectedChannel = activeMembership?.channels.find((chanel) => chanel.id === channelId)
  const { urls: memberAvatarUrls, isLoadingAsset: memberAvatarLoading } = getMemberAvatar(activeMembership)
  const channelAvatarUrls = selectedChannel?.avatarPhoto?.resolvedUrls
  const { ref: sectionContainerRef, height: sectionContainerHeight } = useResizeObserver<HTMLDivElement>({
    box: 'border-box',
  })
  const blockAnimationRef = useRef<HTMLDivElement>(null)

  const hasAtLeastOneChannel = !!activeMembership?.channels.length && activeMembership?.channels.length >= 1
  const hasAtleastTwoChannels = !!activeMembership?.channels.length && activeMembership?.channels.length >= 2

  const dropdownEntity = {
    title: type === 'member' ? activeMembership?.handle : selectedChannel?.title,
    avatarUrls: type === 'member' ? memberAvatarUrls : channelAvatarUrls,
    avatarLoading: type === 'member' ? memberAvatarLoading : false,
    balance: type === 'member' ? memberAvatarLoading : channelBalance,
  }

  const otherChannelUnseenCount =
    unseenNotificationsCounts?.channels &&
    unseenNotificationsCounts.channels.total - unseenNotificationsCounts.channels.current

  return (
    <div ref={blockAnimationRef}>
      <MemberInfoAndBgWrapper>
        <MemberInfoContainer>
          <AvatarContainer>
            <StyledAvatar
              clickable={false}
              size={40}
              assetUrls={dropdownEntity.avatarUrls}
              loading={dropdownEntity.avatarLoading}
            />
            <div>
              <MemberHandleText as="span" variant="h400">
                {dropdownEntity.title}
              </MemberHandleText>
              {type === 'channel' ? (
                channelBalance ? (
                  <UserBalance>
                    <JoyTokenIcon size={16} variant="regular" />
                    <NumberFormat as="span" variant="t200-strong" value={channelBalance} format="short" />
                  </UserBalance>
                ) : (
                  <SkeletonLoader width={30} height={20} />
                )
              ) : (
                <BalanceTooltip
                  containerRefElement={containerRefElement}
                  accountBalance={accountBalance}
                  lockedAccountBalance={lockedAccountBalance}
                >
                  {accountBalance !== undefined ? (
                    <UserBalance>
                      <JoyTokenIcon isNegative={isInDebt} size={16} variant="regular" withoutInformationTooltip />
                      <NumberFormat
                        withTooltip={false}
                        as="span"
                        variant="t200"
                        value={accountBalance}
                        format="short"
                        isNegative={isInDebt}
                      />
                    </UserBalance>
                  ) : (
                    <SkeletonLoader width={30} height={20} />
                  )}
                </BalanceTooltip>
              )}
              <BalanceContainer>
                <FixedSizeContainer height="100%">
                  <TextLink
                    as="span"
                    onClick={() => {
                      onCloseDropdown?.()
                      onShowFundsDialog()
                    }}
                    variant="t100"
                    color="colorCoreNeutral200Lighten"
                  >
                    {type === 'channel' ? 'Withdraw' : 'Transfer'}
                  </TextLink>
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
                  Learn about {atlasConfig.joystream.tokenTicker} <SvgActionNewTab />
                </TextLink>
              </BalanceContainer>
            </div>
            <AddressContainer>
              <CopyAddressButton
                address={(type === 'member' ? activeMembership?.controllerAccount : activeChannel?.rewardAccount) ?? ''}
                size="big"
                truncate
              />
            </AddressContainer>
          </AvatarContainer>
        </MemberInfoContainer>
        <BlurredBG memberUrl={memberAvatarUrls?.[0]} channelUrl={channelAvatarUrls?.[0]} isChannel={type === 'channel'}>
          <Filter />
        </BlurredBG>
      </MemberInfoAndBgWrapper>

      <FixedSizeContainer height={sectionContainerHeight}>
        <AnimatedSectionContainer ref={sectionContainerRef}>
          <ListItemOptions
            publisher={publisher}
            closeDropdown={onCloseDropdown}
            hasAtLeastOneChannel={hasAtLeastOneChannel}
            unseenNotificationsCounts={unseenNotificationsCounts}
            listItems={
              type === 'member'
                ? [
                    {
                      asButton: true,
                      label: 'My profile',
                      onClick: onCloseDropdown,
                      nodeStart: <IconWrapper icon={<SvgActionMember />} />,
                      to: absoluteRoutes.viewer.member(activeMembership?.handle),
                    },
                    {
                      asButton: true,
                      label: hasAtLeastOneChannel ? 'My channels' : 'Create channel',
                      nodeStart: (
                        <IconWrapper icon={hasAtLeastOneChannel ? <SvgActionChannel /> : <SvgActionAddChannel />} />
                      ),
                      nodeEnd: hasAtLeastOneChannel && <SvgActionChevronR />,
                      onClick: () => (hasAtLeastOneChannel ? onSwitchToList(type) : onAddNewChannel?.()),
                    },
                    {
                      asButton: true,
                      label: 'Portfolio',
                      nodeStart: <IconWrapper icon={<SvgActionMoney />} />,
                      to: absoluteRoutes.viewer.portfolio(),
                    },
                  ]
                : [
                    {
                      asButton: true,
                      label: 'View channel',
                      onClick: onCloseDropdown,
                      nodeStart: <IconWrapper icon={<SvgActionShow />} />,
                      to: hasAtLeastOneChannel
                        ? absoluteRoutes.viewer.channel(channelId ?? undefined)
                        : absoluteRoutes.studio.signIn(),
                    },
                    {
                      asButton: true,
                      label: hasAtleastTwoChannels ? 'Switch channel' : 'Add new channel',
                      nodeStart: (
                        <IconWrapper icon={hasAtleastTwoChannels ? <SvgActionChannel /> : <SvgActionAddChannel />} />
                      ),
                      nodeEnd:
                        hasAtleastTwoChannels &&
                        (otherChannelUnseenCount ? (
                          <Badge data-badge={otherChannelUnseenCount} />
                        ) : (
                          <SvgActionChevronR />
                        )),
                      onClick: () => (hasAtleastTwoChannels ? onSwitchToList(type) : onAddNewChannel?.()),
                    },
                  ]
            }
          />
        </AnimatedSectionContainer>
      </FixedSizeContainer>
      <SectionContainer>
        <ListItem
          label="Sign out"
          destructive
          nodeStart={<IconWrapper destructive icon={<SvgActionLogOut />} />}
          onClick={() => {
            onCloseDropdown?.()
            onSignOut()
            navigate(absoluteRoutes.viewer.index())
          }}
        />
      </SectionContainer>
    </div>
  )
}

type ListItemOptionsProps = {
  publisher?: boolean
  hasAtLeastOneChannel?: boolean
  closeDropdown?: () => void
  unseenNotificationsCounts?: UseNotifications['unseenNotificationsCounts']
  listItems: [ListItemProps, ListItemProps] | [ListItemProps]
}
const ListItemOptions: FC<ListItemOptionsProps> = ({
  publisher,
  closeDropdown,
  listItems,
  hasAtLeastOneChannel,
  unseenNotificationsCounts,
}) => {
  return (
    <>
      {listItems.map((listItemsProps, idx) => (
        <ListItem key={idx} {...listItemsProps} />
      ))}
      {publisher ? (
        <ListItem
          onClick={closeDropdown}
          nodeStart={<IconWrapper icon={<SvgActionPlay />} />}
          label={atlasConfig.general.appName}
          to={absoluteRoutes.viewer.index()}
          nodeEnd={<Badge data-badge={unseenNotificationsCounts?.member} />}
        />
      ) : hasAtLeastOneChannel ? (
        <>
          <ListItem
            onClick={closeDropdown}
            nodeStart={<IconWrapper icon={<SvgActionAddVideo />} />}
            label="Studio"
            to={absoluteRoutes.studio.index()}
            nodeEnd={<Badge data-badge={unseenNotificationsCounts?.channels?.total} />}
          />
        </>
      ) : null}
    </>
  )
}
