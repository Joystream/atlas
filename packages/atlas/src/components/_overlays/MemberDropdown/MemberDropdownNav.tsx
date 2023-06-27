import BN from 'bn.js'
import { FC, useRef } from 'react'
import useResizeObserver from 'use-resize-observer'

import { FullMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import {
  SvgActionAddChannel,
  SvgActionAddVideo,
  SvgActionChannel,
  SvgActionChevronR,
  SvgActionLogOut,
  SvgActionMember,
  SvgActionNewTab,
  SvgActionPlay,
  SvgActionSwitchMember,
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

import { BalanceTooltip } from './BalanceTooltip'
import { SectionContainer } from './MemberDropdown.styles'
import {
  AddressContainer,
  AnimatedSectionContainer,
  AvatarContainer,
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
  containerRefElement: Element | null
  onCloseDropdown?: () => void
  onAddNewChannel?: () => void
  onSwitchToList: (type: DropdownType) => void
  onSignOut: () => void
  onShowFundsDialog: () => void
  activeMembership?: FullMembershipFieldsFragment | null
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
}) => {
  const selectedChannel = activeMembership?.channels.find((chanel) => chanel.id === channelId)
  const { url: memberAvatarUrl, isLoadingAsset: memberAvatarLoading } = getMemberAvatar(activeMembership)
  const channelAvatarUrl = selectedChannel?.avatarPhoto?.resolvedUrl
  const { ref: sectionContainerRef, height: sectionContainerHeight } = useResizeObserver<HTMLDivElement>({
    box: 'border-box',
  })
  const blockAnimationRef = useRef<HTMLDivElement>(null)

  const hasAtLeastOneChannel = activeMembership?.channels.length && activeMembership?.channels.length >= 1
  const hasAtleastTwoChannels = activeMembership?.channels.length && activeMembership?.channels.length >= 2

  const dropdownEntity = {
    title: type === 'member' ? activeMembership?.handle : selectedChannel?.title,
    avatarUrl: type === 'member' ? memberAvatarUrl : channelAvatarUrl,
    avatarLoading: type === 'member' ? memberAvatarLoading : false,
    balance: type === 'member' ? memberAvatarLoading : channelBalance,
  }

  return (
    <div ref={blockAnimationRef}>
      <MemberInfoAndBgWrapper>
        <MemberInfoContainer>
          <AvatarContainer>
            <StyledAvatar
              clickable={false}
              size={40}
              assetUrl={dropdownEntity.avatarUrl}
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
              <CopyAddressButton address={activeMembership?.controllerAccount ?? ''} size="big" truncate />
            </AddressContainer>
          </AvatarContainer>
        </MemberInfoContainer>
        <BlurredBG memberUrl={memberAvatarUrl} channelUrl={channelAvatarUrl} isChannel={type === 'channel'}>
          <Filter />
        </BlurredBG>
      </MemberInfoAndBgWrapper>

      <FixedSizeContainer height={sectionContainerHeight}>
        <AnimatedSectionContainer ref={sectionContainerRef}>
          {type === 'member' ? (
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
                  label: hasAtLeastOneChannel ? 'My channels' : 'Add new channel',
                  nodeStart: (
                    <IconWrapper icon={hasAtLeastOneChannel ? <SvgActionChannel /> : <SvgActionAddChannel />} />
                  ),
                  nodeEnd: hasAtLeastOneChannel && <SvgActionChevronR />,
                  onClick: () => (hasAtLeastOneChannel ? onSwitchToList(type) : onAddNewChannel?.()),
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
                  label: 'View channel',
                  onClick: onCloseDropdown,
                  nodeStart: <IconWrapper icon={<SvgActionChannel />} />,
                  to: hasAtLeastOneChannel
                    ? absoluteRoutes.viewer.channel(channelId ?? undefined)
                    : absoluteRoutes.studio.signIn(),
                },
                {
                  asButton: true,
                  label: hasAtleastTwoChannels ? 'Switch channel' : 'Add new channel',
                  nodeStart: <IconWrapper icon={<SvgActionSwitchMember />} />,
                  nodeEnd: hasAtleastTwoChannels && <SvgActionChevronR />,
                  onClick: () => (hasAtleastTwoChannels ? onSwitchToList(type) : onAddNewChannel?.()),
                },
              ]}
            />
          )}
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
          }}
        />
      </SectionContainer>
    </div>
  )
}

type ListItemOptionsProps = {
  publisher?: boolean
  closeDropdown?: () => void
  listItems: [ListItemProps, ListItemProps] | [ListItemProps]
}
const ListItemOptions: FC<ListItemOptionsProps> = ({ publisher, closeDropdown, listItems }) => {
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
    </>
  )
}
