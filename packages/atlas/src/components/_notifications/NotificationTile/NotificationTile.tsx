import { differenceInCalendarYears, differenceInDays, format } from 'date-fns'
import { FC, ReactElement, ReactNode, useMemo, useRef } from 'react'

import {
  SvgActionAddVideo,
  SvgActionCheck,
  SvgActionCouncil,
  SvgActionDislikeOutline,
  SvgActionInformative,
  SvgActionLikeOutline,
  SvgActionMore,
  SvgActionNft,
  SvgActionNotifications,
  SvgActionPlaceholder,
  SvgActionRevenueShare,
} from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { KebabMenuButtonIcon } from '@/components/_nft/NftTile/NftTileDetails.styles'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { absoluteRoutes } from '@/config/routes'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { NotificationRecord } from '@/providers/notifications/notifications.types'
import { useUser } from '@/providers/user/user.hooks'
import { formatDateAgo } from '@/utils/time'

import { NoActorNotificationAvatar } from './NoActorNotificationAvatar'
import { IconContainer, IconWrapper, StyledLink, StyledListItem } from './NotificationTile.styles'

// TODO make all fields required
type NotificationUX = {
  icon?: ReactNode
  link?: string
  avatar?: { type: 'current-channel' | 'current-membership' | 'channel' | 'membership'; value: string }
  text: ReactNode
}
const getNotificationUX = (notification: NotificationRecord, channelTitle?: string): NotificationUX => {
  switch (notification.type) {
    //
    // Member notifications events
    //

    // Generic
    case 'ChannelCreated':
      return {
        avatar: { type: 'channel', value: notification.channelId },
        text: <>New channel created: “{notification.channelTitle}“</>,
      }

    // Engagement
    case 'CommentReply':
      return {
        avatar: { type: 'membership', value: notification.memberHandle },
        text: (
          <>
            {notification.memberHandle} replied to your commend under video: “{notification.videoTitle}”
          </>
        ),
      }
    case 'ReactionToComment':
      return {
        avatar: { type: 'membership', value: notification.memberHandle },
        text: (
          <>
            {notification.memberHandle} reacted to your commend on the video: “{notification.videoTitle}”
          </>
        ),
      }

    // Followed channels
    case 'VideoPosted':
      return {
        // avatar: { type: 'channel', value: notification.channelId }, // AVATAR MISSING
        text: (
          <>
            {notification.channelTitle} posted a new video: “{notification.videoTitle}”
          </>
        ),
      }
    case 'NewNftOnSale':
      return {
        // avatar: { type: 'channel', value: notification.channelId }, // AVATAR MISSING
        text: (
          <>
            {notification.channelTitle} started the sale of NFT: “{notification.videoTitle}”
          </>
        ),
      }
    case 'NewAuction':
      return {
        // avatar: { type: 'channel', value: notification.channelId }, // AVATAR MISSING
        text: (
          <>
            {notification.channelTitle} started an auction for NFT: “{notification.videoTitle}”
          </>
        ),
      }

    // NFT
    case 'HigherBidPlaced':
      return {
        avatar: { type: 'membership', value: notification.newBidderHandle },
        text: (
          <>
            {notification.newBidderHandle} placed a higher bid in the auction for NFT: “{notification.videoTitle}”
          </>
        ),
      }
    case 'EnglishAuctionWon':
      return {
        avatar: { type: 'current-membership', value: '' },
        text: <>You won a timed auction for NFT: “{notification.videoTitle}”</>,
      }
    case 'EnglishAuctionLost':
      return {
        avatar: { type: 'current-membership', value: '' },
        text: <>You lost a timed auction for NFT: “{notification.videoTitle}”</>,
      }
    case 'OpenAuctionWon':
      return {
        avatar: { type: 'current-membership', value: '' },
        text: <>You won an open auction for NFT: “{notification.videoTitle}”</>,
      }
    case 'OpenAuctionLost':
      return {
        avatar: { type: 'current-membership', value: '' },
        text: <>You lost an open auction for NFT: “{notification.videoTitle}”</>,
      }
    // case 'NFT bid becomes withdrawable (for bidder)': // MISSING
    //   return {
    //     avatar: { type: 'current-membership', value: '' },
    //     text: <>Your bid is withdrawable for NFT: “{notification.videoTitle}”</>,
    //   }

    // Payouts
    // case 'Funds received': // MISSING
    //   return {
    //     avatar: { type: 'channel', value: notification.channelId },
    //     text: (
    //       <>
    //         You have received{' '}
    //         <NumberFormat as="span" value={notification.amount} format="short" withToken withDenomination="before" />{' '}
    //         for your channel “{notification.channelTitle}” from Council Payout proposal
    //       </>
    //     ),
    //   }
    // case 'Funds sent': // MISSING
    //   return {
    //     avatar: { type: 'channel', value: notification.channelId },
    //     text: (
    //       <>
    //         You transferred{' '}
    //         <NumberFormat as="span" value={notification.amount} format="short" withToken withDenomination="before" />{' '}
    //         from you member wallet to external wallet: {notification.walletaddress}
    //       </>
    //     ),
    //   }
    // case 'Member received transfer from DAO WG': // MISSING
    //   return {
    //     avatar: { type: 'channel', value: notification.channelId },
    //     text: (
    //       <>
    //         You have received{' '}
    //         <NumberFormat as="span" value={notification.amount} format="short" withToken withDenomination="before" />{' '}
    //         from “{notification.group}” working group
    //       </>
    //     ),
    //   }

    //
    // Channel notifications events
    //

    // Content moderation and featuring
    case 'ChannelExcluded':
      return {
        avatar: { type: 'current-channel', value: '' },
        text: <>Your channel “{channelTitle}” is excluded from App</>,
      }
    case 'VideoExcluded':
      return {
        avatar: { type: 'current-channel', value: '' },
        text: <>Your video is excluded from App: “{notification.videoTitle}”</>,
      }
    case 'VideoFeaturedOnCategoryPage':
      return {
        avatar: { type: 'current-channel', value: '' },
        text: (
          <>
            Your video was featured on the “{notification.categoryName}” category page: “{notification.videoTitle}”
          </>
        ),
      }
    case 'NftFeaturedOnMarketPlace':
      return {
        avatar: { type: 'current-channel', value: '' },
        text: <>Your NFT was featured in the marketplace featured section: “{notification.videoTitle}”</>,
      }
    case 'VideoFeaturedAsCategoryHero':
      return {
        avatar: { type: 'current-channel', value: '' },
        text: (
          <>
            “{notification.categoryName}” category page featured your video as the category hero video: “How can Web3
            use AI?”
          </>
        ),
      }

    // Engagement
    case 'NewChannelFollower':
      return {
        avatar: { type: 'membership', value: notification.followerHandle },
        text: <>{notification.followerHandle} followed your channel</>,
      }
    case 'CommentPostedToVideo':
      return {
        avatar: { type: 'membership', value: notification.memberHandle },
        text: (
          <>
            {notification.memberHandle} left a comment on your video: “{notification.videoTitle}”
          </>
        ),
      }
    case 'VideoLiked':
      return {
        // avatar: { type: 'membership', value: notification.memberHandle }, // AVATAR MISSING
        text: (
          <>
            {/*notification.memberHandle*/ 'Someone'} liked your video: “{notification.videoTitle}”
          </>
        ),
      }
    case 'VideoDisliked':
      return {
        // avatar: { type: 'membership', value: notification.memberHandle }, // AVATAR MISSING
        text: (
          <>
            {/*notification.memberHandle*/ 'Someone'} disliked your video: “{notification.videoTitle}”
          </>
        ),
      }

    // Youtube Partnership Program
    // case 'YPP sign up successful': // MISSING
    //   return {
    //     avatar: { type: 'current-channel', value: '' },
    //     text: <>Your channel was successfully signed up for Youtube Partnership Program</>,
    //   }
    // case 'Someone signed up using your referral link': // MISSING
    //   return {
    //     avatar: { type: 'membership', value: notification.memberHandle },
    //     text: <>{notification.memberHandle} signed up for YPP using your referral link</>,
    //   }
    case 'ChannelVerified':
      return {
        avatar: { type: 'current-channel', value: '' },
        text: <>Your channel got verified in our Youtube Partnership Program</>,
      }
    case 'ChannelSuspended':
      return {
        avatar: { type: 'current-channel', value: '' },
        text: <>Your channel got suspended in our Youtube Partnership Program</>,
      }

    // NFTs Auctions
    case 'NftPurchased':
      return {
        avatar: { type: 'membership', value: notification.buyerHandle },
        text: (
          <>
            {notification.buyerHandle} purchased for{' '}
            <NumberFormat as="span" value={notification.price} format="short" withToken withDenomination="before" />{' '}
            your NFT: “{notification.videoTitle}”
          </>
        ),
      }
    case 'NftRoyaltyPaid':
      return {
        avatar: { type: 'current-channel', value: '' },
        text: (
          <>
            You received{' '}
            <NumberFormat as="span" value={notification.amount} format="short" withToken withDenomination="before" />{' '}
            royalties from your NFT: “{notification.videoTitle}”
          </>
        ),
      }
    case 'CreatorReceivesAuctionBid':
      return {
        avatar: { type: 'membership', value: notification.bidderHandle },
        text: (
          <>
            {notification.bidderHandle} placed a bid of{' '}
            <NumberFormat as="span" value={notification.amount} format="short" withToken withDenomination="before" />{' '}
            for your NFT: “{notification.videoTitle}”
          </>
        ),
      }
    case 'EnglishAuctionSettled':
      return {
        avatar: { type: 'current-channel', value: '' },
        text: <>Timed auction expired on your NFT: “{notification.videoTitle}”</>,
      }

    // Payouts
    case 'DirectChannelPaymentByMember':
      return {
        avatar: { type: 'membership', value: notification.payerHandle },
        text: (
          <>
            {notification.payerHandle} transferred{' '}
            <NumberFormat as="span" value={notification.amount} format="short" withToken withDenomination="before" /> to
            your channel
          </>
        ),
      }
    // case 'Channel received transfer from WG': // MISSING
    //   return {
    //     avatar: { type: 'current-channel', value: '' },
    //     text: (
    //       <>
    //         You have received{' '}
    //         <NumberFormat as="span" value={notification.amount} format="short" withToken withDenomination="before" />{' '}
    //         from “marketing” working group
    //       </>
    //     ),
    //   }
    // case 'New payout is claimable from Council Payout proposal': // MISSING
    //   return {
    //     avatar: { type: 'current-channel', value: '' },
    //     text: (
    //       <>
    //         You have{' '}
    //         <NumberFormat as="span" value={notification.amount} format="short" withToken withDenomination="before" /> to
    //         claim from Council Payout proposal
    //       </>
    //     ),
    //   }
    case 'ChannelFundsWithdrawn':
      return {
        avatar: { type: 'current-membership', value: '' },
        text: (
          <>
            <NumberFormat as="span" value={notification.amount} format="short" withToken withDenomination="before" />{' '}
            transferred from your channel to your membership account
          </>
        ),
      }
  }
}

export type NotificationProps = {
  notification: NotificationRecord
  loading?: boolean
  onClick?: () => void
  className?: string
  onMarkAsRead?: () => void
}

export const NotificationTile: FC<NotificationProps> = ({
  notification,
  loading,
  onClick,
  className,
  onMarkAsRead,
}) => {
  const { activeChannel } = useUser()
  const { icon, link, avatar, text } = getNotificationUX(notification, activeChannel?.title ?? undefined)
  const { date, member, read } = notification
  const { urls: avatarUrls } = getMemberAvatar(member)
  const ref = useRef<HTMLButtonElement>(null)
  const contextMenuInstanceRef = useRef<PopoverImperativeHandle>(null)
  const formattedDate = useMemo(() => {
    const differenceDays = differenceInDays(new Date(), date)
    const differenceYears = differenceInCalendarYears(new Date(), date)
    if (differenceYears >= 1) {
      return format(date, 'dd LLL yyyy')
    }
    if (differenceDays > 3) {
      return format(date, 'LLL d')
    }
    return formatDateAgo(date)
  }, [date])

  return (
    <StyledLink
      to={absoluteRoutes.viewer.video(notification.video.id, {
        ...(notification.type === 'video-commented' || notification.type === 'comment-reply'
          ? { commentId: notification.commentId }
          : {}),
      })}
      onClick={() => {
        onClick?.()
        onMarkAsRead?.()
      }}
      onPointerLeave={() => contextMenuInstanceRef.current?.hide()}
    >
      <StyledListItem
        loading={loading}
        read={read}
        variant="compact"
        className={className}
        nodeStart={
          member ? (
            <NotifactionIcon avatarUrls={avatarUrls ?? []} iconType={getNotificationIcon(notification)} />
          ) : (
            <NoActorNotificationAvatar size="small" />
          )
        }
        caption={!loading ? formattedDate : <SkeletonLoader width="50%" height={19} />}
        label={
          !loading ? (
            <>
              {member && (
                <Text as="span" variant="t100">
                  {`${member.handle} `}
                </Text>
              )}
              <Text as="span" variant="t100">
                {text}
              </Text>
            </>
          ) : (
            <SkeletonLoader width="40%" height={20} bottomSpace={2} />
          )
        }
        nodeEnd={
          <div
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            <KebabMenuButtonIcon
              ref={ref}
              icon={<SvgActionMore />}
              variant="tertiary"
              size="small"
              isActive={!loading}
              className="kebab-button"
            />
            <ContextMenu
              ref={contextMenuInstanceRef}
              appendTo={ref.current ?? undefined}
              placement="bottom-end"
              flipEnabled={false}
              disabled={loading}
              items={read ? [] : [{ label: 'Mark as read', nodeStart: <SvgActionCheck />, onClick: onMarkAsRead }]}
              trigger={null}
              triggerTarget={ref.current}
            />
          </div>
        }
      />
    </StyledLink>
  )
}

type NotificationIconType = 'like' | 'dislike' | 'follow' | 'warning' | 'bell' | 'nft' | 'payout' | 'reaction' | 'video'

type NotifactionIconProps = {
  avatarUrls: string[]
  iconType: NotificationIconType
}

const notificationIconMapper: Record<NotificationIconType, [ReactElement, 'red' | 'blue' | 'green' | 'gray']> = {
  bell: [<SvgActionNotifications key={1} />, 'gray'],
  dislike: [<SvgActionDislikeOutline key={1} />, 'red'],
  follow: [<SvgActionCouncil key={1} />, 'blue'],
  reaction: [<SvgActionPlaceholder key={1} />, 'blue'],
  like: [<SvgActionLikeOutline key={1} />, 'blue'],
  nft: [<SvgActionNft key={1} />, 'green'],
  payout: [<SvgActionRevenueShare key={1} />, 'green'],
  warning: [<SvgActionInformative key={1} />, 'gray'],
  video: [<SvgActionAddVideo key={1} />, 'blue'],
}

const getNotificationIcon = (notification: NotificationRecord): NotificationIconType => {
  switch (notification.type) {
    case 'bought':
    case 'bid-accepted':
    case 'got-outbid':
    case 'auction-settled-winner':
    case 'auction-ended':
    case 'auction-settled-owner':
    case 'bid-made':
      return 'nft'
    case 'video-commented':
    case 'comment-reply':
      return 'reaction'
    default:
      return 'bell'
  }
}
export const NotifactionIcon = ({ iconType, avatarUrls }: NotifactionIconProps) => {
  const [icon, color] = notificationIconMapper[iconType]
  return (
    <IconWrapper>
      <Avatar size={40} assetUrls={avatarUrls} />
      <IconContainer className="notification-icon-container" color={color}>
        {icon}
      </IconContainer>
    </IconWrapper>
  )
}
