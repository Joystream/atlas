import { BN } from 'bn.js'
import { FC, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { animated, useTransition } from 'react-spring'
import useResizeObserver from 'use-resize-observer'

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
import { useSubscribeAccountBalance } from '@/providers/joystream'
import { useUser, useUserStore } from '@/providers/user'

import { BalanceTooltip } from './BalanceTooltip'
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
  SectionContainer,
  StyledAvatar,
  StyledIconWrapper,
  TextLink,
  UserBalance,
} from './MemberDropdown.styles'

import { SendFundsDialog, WithdrawFundsDialog } from '../SendTransferDialogs'

type DropdownType = 'member' | 'channel'

type MemberDropdownNavProps = {
  type: 'member' | 'channel'
  publisher?: boolean
  closeDropdown?: () => void
  switchDropdownType: (type: DropdownType) => void
  switchToList: (type: DropdownType) => void
}

export const MemberDropdownNav: FC<MemberDropdownNavProps> = ({
  type,
  publisher,
  closeDropdown,
  switchDropdownType,
  switchToList,
}) => {
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
  const [showSendDialog, setShowSendDialog] = useState(false)
  const navigate = useNavigate()
  const { channelId, activeMembership, memberships, signOut } = useUser()
  const selectedChannel = activeMembership?.channels.find((chanel) => chanel.id === channelId)
  const { url: memberAvatarUrl, isLoadingAsset: memberAvatarLoading } = useMemberAvatar(activeMembership)
  const { url: channelAvatarUrl, isLoadingAsset: isChannelAvatarLoading } = useAsset(selectedChannel?.avatarPhoto)
  const { accountBalance, lockedAccountBalance } = useSubscribeAccountBalance()
  const { accountBalance: channelBalance } = useSubscribeAccountBalance(selectedChannel?.rewardAccount) || new BN(0)
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
  })

  const hasOneMember = memberships?.length === 1
  const hasAtLeastOneChannel = activeMembership?.channels.length && activeMembership?.channels.length >= 1

  const toggleWithdrawDialog = () => setShowWithdrawDialog((prevState) => !prevState)
  const toggleSendDialog = () => setShowSendDialog((prevState) => !prevState)

  const handleAddNewMember = () => {
    setSignInModalOpen(true)
    closeDropdown?.()
  }
  return (
    <div ref={blockAnimationRef}>
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
      <BlurredBG url={type === 'member' ? memberAvatarUrl : channelAvatarUrl}>
        <Filter />
        <MemberInfoContainer>
          <AvatarsGroupContainer>
            <AvatarWrapper>
              <Tooltip text="Member" offsetY={16} placement="bottom">
                <StyledAvatar
                  onClick={() => switchDropdownType('member')}
                  isDisabled={type === 'channel'}
                  size="small"
                  assetUrl={memberAvatarUrl}
                  loading={memberAvatarLoading}
                />
              </Tooltip>
              <StyledIconWrapper size="small" icon={<SvgActionMember width={14} height={14} />} />
            </AvatarWrapper>
            <AvatarWrapper>
              <Tooltip text={hasAtLeastOneChannel ? 'Channel' : 'Create channel'} offsetY={16} placement="bottom">
                <StyledAvatar
                  onClick={() =>
                    hasAtLeastOneChannel ? switchDropdownType('channel') : navigate(absoluteRoutes.studio.newChannel())
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
              </Tooltip>
              <StyledIconWrapper icon={<SvgActionChannel width={14} height={14} />} size="small" />
            </AvatarWrapper>
          </AvatarsGroupContainer>
          <FixedSizeContainer height={memberContainerHeight}>
            {memberChanneltransition((style, item) =>
              item === 'channel' ? (
                <animated.div style={style} ref={memberContainerRef}>
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
                </animated.div>
              ) : (
                <animated.div style={style} ref={memberContainerRef}>
                  <BalanceTooltip accountBalance={accountBalance} lockedAccountBalance={lockedAccountBalance}>
                    <MemberHandleText as="span" variant="h400">
                      {activeMembership?.handle}
                    </MemberHandleText>
                    {accountBalance !== undefined ? (
                      <UserBalance>
                        <JoyTokenIcon size={16} variant="regular" withoutInformationTooltip />
                        <NumberFormat as="span" variant="t200-strong" value={accountBalance} format="short" />
                      </UserBalance>
                    ) : (
                      <SkeletonLoader width={30} height={20} />
                    )}
                  </BalanceTooltip>
                </animated.div>
              )
            )}
          </FixedSizeContainer>
          <BalanceContainer>
            <FixedSizeContainer width={textLinkWidth} height="100%">
              {memberChanneltransition(({ opacity, position }) => (
                <AnimatedTextLink
                  ref={textLinkRef}
                  as="span"
                  style={{ opacity, position }}
                  onClick={() => {
                    closeDropdown?.()
                    type === 'channel' ? setShowWithdrawDialog(true) : setShowSendDialog(true)
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
                closeDropdown={closeDropdown}
                listItems={[
                  {
                    asButton: true,
                    label: 'My profile',
                    onClick: closeDropdown,
                    nodeStart: <IconWrapper icon={<SvgActionMember />} />,
                    to: absoluteRoutes.viewer.member(activeMembership?.handle),
                  },
                  {
                    asButton: true,
                    label: hasOneMember ? 'Add new member...' : 'Switch member',
                    nodeStart: <IconWrapper icon={hasOneMember ? <SvgActionPlus /> : <SvgActionSwitchMember />} />,
                    nodeEnd: !hasOneMember && <SvgActionChevronR />,
                    onClick: () => (hasOneMember ? handleAddNewMember() : switchToList(type)),
                  },
                ]}
              />
            ) : (
              <ListItemOptions
                publisher={publisher}
                closeDropdown={closeDropdown}
                listItems={[
                  {
                    asButton: true,
                    label: 'My channel',
                    onClick: closeDropdown,
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
                    onClick: () => switchToList(type),
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
            closeDropdown?.()
            signOut()
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
