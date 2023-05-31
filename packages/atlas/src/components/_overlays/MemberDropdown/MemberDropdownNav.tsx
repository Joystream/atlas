import bezier from 'bezier-easing'
import BN from 'bn.js'
import { FC, useRef } from 'react'
import { useNavigate } from 'react-router'
import { animated, useTransition } from 'react-spring'
import useResizeObserver from 'use-resize-observer'

import { FullMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
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
} from '@/assets/icons'
import { IconWrapper } from '@/components/IconWrapper'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { ListItem, ListItemProps } from '@/components/ListItem'
import { NumberFormat } from '@/components/NumberFormat'
import { Tooltip } from '@/components/Tooltip'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useUserStore } from '@/providers/user/user.store'
import { cVar } from '@/styles'
import { isMobile } from '@/utils/browser'

import { BalanceTooltip } from './BalanceTooltip'
import { SectionContainer } from './MemberDropdown.styles'
import {
  AddAvatar,
  AnimatedSectionContainer,
  AnimatedTextLink,
  AvatarButton,
  AvatarsGroupContainer,
  BalanceContainer,
  BlurredBG,
  Divider,
  Filter,
  FixedSizeContainer,
  MemberHandleText,
  MemberInfoAndBgWrapper,
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
  membershipLoading?: boolean
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
  onSwitchDropdownType,
  onSwitchToList,
  onSignOut,
  onShowFundsDialog,
  channelId,
  activeMembership,
  membershipLoading,
  hasOneMember,
  accountBalance,
  lockedAccountBalance,
  channelBalance,
  isInDebt,
}) => {
  const navigate = useNavigate()
  const selectedChannel = activeMembership?.channels.find((chanel) => chanel.id === channelId)
  const { url: memberAvatarUrl, isLoadingAsset: memberAvatarLoading } = getMemberAvatar(activeMembership)
  const channelAvatarUrl = selectedChannel?.avatarPhoto?.resolvedUrl
  const setSignInModalOpen = useUserStore((state) => state.actions.setSignInModalOpen)
  const memberAvatarWrapperRef = useRef<HTMLButtonElement>(null)
  const channelAvatarWrapperRef = useRef<HTMLButtonElement>(null)

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
  const hasAtleastTwoChannels = activeMembership?.channels.length && activeMembership?.channels.length >= 2

  const handleAddNewMember = () => {
    setSignInModalOpen(true)
    onCloseDropdown?.()
  }

  return (
    <div ref={blockAnimationRef}>
      <MemberInfoAndBgWrapper>
        <MemberInfoContainer>
          <AvatarsGroupContainer>
            {!isMobile() && (
              <Tooltip reference={memberAvatarWrapperRef.current} text="Member" offsetY={16} placement="bottom" />
            )}
            <AvatarButton
              onClick={() => onSwitchDropdownType('member')}
              ref={memberAvatarWrapperRef}
              aria-label="Show member details"
            >
              <StyledAvatar
                clickable={false}
                isDisabled={type === 'channel'}
                size={40}
                assetUrl={memberAvatarUrl}
                loading={memberAvatarLoading}
              />
              <StyledIconWrapper size="small" icon={<SvgActionMember />} />
            </AvatarButton>
            {!isMobile() && (
              <Tooltip
                reference={channelAvatarWrapperRef.current}
                text={hasAtLeastOneChannel ? 'Channel' : 'Create channel'}
                offsetY={16}
                placement="bottom"
              />
            )}
            <AvatarButton
              onClick={() =>
                hasAtLeastOneChannel ? onSwitchDropdownType('channel') : navigate(absoluteRoutes.studio.newChannel())
              }
              ref={channelAvatarWrapperRef}
              aria-label="Show channel details"
            >
              <StyledAvatar
                clickable={false}
                isDisabled={type === 'member'}
                size={40}
                assetUrl={channelAvatarUrl}
                loading={membershipLoading}
              >
                {!hasAtLeastOneChannel ? (
                  <AddAvatar>
                    <SvgActionPlus />
                  </AddAvatar>
                ) : null}
              </StyledAvatar>
              <StyledIconWrapper icon={<SvgActionChannel />} size="small" />
            </AvatarButton>
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
                          <JoyTokenIcon isNegative={isInDebt} size={16} variant="regular" withoutInformationTooltip />
                          <NumberFormat
                            withTooltip={false}
                            as="span"
                            variant="t200-strong"
                            value={accountBalance}
                            format="short"
                            isNegative={isInDebt}
                          />
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
              Learn about {atlasConfig.joystream.tokenTicker} <SvgActionNewTab />
            </TextLink>
          </BalanceContainer>
        </MemberInfoContainer>
        <BlurredBG memberUrl={memberAvatarUrl} channelUrl={channelAvatarUrl} isChannel={type === 'channel'}>
          <Filter />
        </BlurredBG>
      </MemberInfoAndBgWrapper>

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
                    label: hasAtleastTwoChannels ? 'Switch channel' : 'Add new channel',
                    nodeStart: <IconWrapper icon={<SvgActionSwitchMember />} />,
                    nodeEnd: hasAtleastTwoChannels && <SvgActionChevronR />,
                    onClick: () => (hasAtleastTwoChannels ? onSwitchToList(type) : onCloseDropdown?.()),
                    to: hasAtleastTwoChannels ? undefined : absoluteRoutes.studio.newChannel(),
                  },
                ]}
              />
            )}
          </AnimatedSectionContainer>
        ))}
      </FixedSizeContainer>
      <SectionContainer>
        <ListItem
          label="Log out"
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
      {listItems.map((listItemsProps, idx) => (
        <ListItem key={idx} {...listItemsProps} />
      ))}
    </>
  )
}
