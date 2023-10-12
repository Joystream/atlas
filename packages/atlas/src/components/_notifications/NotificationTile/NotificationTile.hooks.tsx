import { ReactElement, ReactNode, useMemo } from 'react'
import { LinkProps } from 'react-router-dom'

import { useGetChannelAvatarQuery } from '@/api/queries/__generated__/channels.generated'
import { useGetMembershipsAvatarQuery } from '@/api/queries/__generated__/memberships.generated'
import {
  SvgActionAddVideo,
  SvgActionCouncil,
  SvgActionDislikeOutline,
  SvgActionInformative,
  SvgActionLikeOutline,
  SvgActionNft,
  SvgActionNotifications,
  SvgActionPlaceholder,
  SvgActionRevenueShare,
} from '@/assets/icons'
import { NumberFormat } from '@/components/NumberFormat'
import { absoluteRoutes } from '@/config/routes'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { NotificationRecord } from '@/providers/notifications/notifications.types'
import { useUser } from '@/providers/user/user.hooks'

export type NotificationIconType =
  | 'like'
  | 'dislike'
  | 'follow'
  | 'warning'
  | 'bell'
  | 'nft'
  | 'nft-alt'
  | 'payout'
  | 'reaction'
  | 'video'

export const notificationIconMapper: Record<NotificationIconType, [ReactElement, 'red' | 'blue' | 'green' | 'gray']> = {
  bell: [<SvgActionNotifications key={1} />, 'gray'],
  dislike: [<SvgActionDislikeOutline key={1} />, 'red'],
  follow: [<SvgActionCouncil key={1} />, 'blue'],
  reaction: [<SvgActionPlaceholder key={1} />, 'blue'],
  like: [<SvgActionLikeOutline key={1} />, 'blue'],
  nft: [<SvgActionNft key={1} />, 'green'],
  'nft-alt': [<SvgActionNft key={1} />, 'red'],
  payout: [<SvgActionRevenueShare key={1} />, 'green'],
  warning: [<SvgActionInformative key={1} />, 'gray'],
  video: [<SvgActionAddVideo key={1} />, 'blue'],
}

type NotificationAvatarType = 'active-channel' | 'active-membership' | 'channel' | 'membership'

export const useNotificationAvatar = (
  avatar: NotificationUX['avatar']
): { avatarUrls: string[]; isLoading: boolean } => {
  const { activeChannel, activeMembership } = useUser()

  const memberHandle = avatar.type === 'membership' ? avatar.params?.[0] : undefined
  const { data: memberData, loading: isMemberLoading } = useGetMembershipsAvatarQuery({
    variables: { where: { handle_eq: memberHandle }, limit: 1 },
    skip: !memberHandle,
  })
  const member = avatar.type === 'active-membership' ? activeMembership : memberData?.memberships[0]

  const channelId = avatar.type === 'channel' ? avatar.params?.[0] : undefined
  const { data: channelData, loading: isChannelLoading } = useGetChannelAvatarQuery({
    variables: { id: channelId ?? '' },
    skip: !channelId,
  })
  const channel = avatar.type === 'active-channel' ? activeChannel : channelData?.channelById

  switch (avatar.type) {
    case 'active-membership':
    case 'membership':
      return { avatarUrls: getMemberAvatar(member).urls ?? [], isLoading: isMemberLoading }

    case 'active-channel':
    case 'channel':
      if (!channel?.avatarPhoto?.isAccepted) break
      return { avatarUrls: channel.avatarPhoto.resolvedUrls ?? [], isLoading: isChannelLoading }
  }

  return { avatarUrls: [], isLoading: false }
}

type ActionType =
  | 'video-page'
  | 'nft-page'
  | 'channel-page'
  | 'term-of-sevice-page'
  | 'category-page'
  | 'marketplace-page'
  | 'member-page'
  | 'ypp-dashboard'
  | 'payments-page'

export const useNotificationAction = (action: NotificationUX['action']) =>
  useMemo(() => getNotificationAction(action), [action])

const getNotificationAction = ({
  type,
  params = [],
}: NotificationUX['action']): { to: string; state?: LinkProps['state'] } => {
  switch (type) {
    case 'video-page':
      return { to: absoluteRoutes.viewer.video(params[0], { commentId: params[1] }), state: { shouldCollapse: true } }

    case 'nft-page':
      return { to: absoluteRoutes.viewer.video(params[0]), state: { shouldCollapse: false } }

    case 'channel-page':
      return { to: absoluteRoutes.viewer.channel(params[0]) }

    case 'member-page':
      return { to: absoluteRoutes.viewer.member(params[0]) }

    case 'category-page':
      return { to: absoluteRoutes.viewer.category(params[0]) }

    case 'marketplace-page':
      return { to: absoluteRoutes.viewer.marketplace() }

    case 'payments-page':
      return { to: absoluteRoutes.studio.payments() }

    case 'ypp-dashboard':
      return { to: absoluteRoutes.viewer.yppDashboard() }

    case 'term-of-sevice-page':
      return { to: absoluteRoutes.legal.termsOfService() }
  }
}

type NotificationUX = {
  icon: NotificationIconType
  action: { type: ActionType; params?: string[] }
  avatar: { type: NotificationAvatarType; params?: string[] }
  text: ReactNode
}

export const useNotificationUX = (notification: NotificationRecord) => {
  const { activeChannel } = useUser()
  return useMemo(
    () => getNotificationUX(notification, activeChannel?.title ?? undefined),
    [notification, activeChannel]
  )
}

const getNotificationUX = (notification: NotificationRecord, channelTitle?: string): NotificationUX => {
  switch (notification.type) {
    //
    // Member notifications events
    //

    // Generic
    case 'ChannelCreated':
      return {
        icon: 'bell',
        action: { type: 'channel-page', params: [notification.channelId] },
        avatar: { type: 'channel', params: [notification.channelId] },
        text: <>New channel created: “{notification.channelTitle}“</>,
      }

    // Engagement
    case 'CommentReply':
      return {
        icon: 'follow',
        action: { type: 'video-page', params: [notification.videoId, notification.commentId] },
        avatar: { type: 'membership', params: [notification.memberHandle] },
        text: (
          <>
            {notification.memberHandle} replied to your comment under the video: “{notification.videoTitle}”
          </>
        ),
      }
    case 'ReactionToComment':
      return {
        icon: 'reaction',
        action: { type: 'video-page', params: [notification.videoId, notification.commentId] },
        avatar: { type: 'membership', params: [notification.memberHandle] },
        text: (
          <>
            {notification.memberHandle} reacted to your comment on the video: “{notification.videoTitle}”
          </>
        ),
      }

    // Followed channels
    case 'VideoPosted':
      return {
        icon: 'video',
        action: { type: 'video-page', params: [notification.videoId] },
        avatar: { type: 'channel', params: [notification.channelId] },
        text: (
          <>
            {notification.channelTitle} posted a new video: “{notification.videoTitle}”
          </>
        ),
      }
    case 'NewNftOnSale':
      return {
        icon: 'nft',
        action: { type: 'nft-page', params: [notification.videoId] },
        avatar: { type: 'channel', params: [notification.channelId] },
        text: (
          <>
            {notification.channelTitle} started the sale of NFT: “{notification.videoTitle}”
          </>
        ),
      }
    case 'NewAuction':
      return {
        icon: 'nft',
        action: { type: 'nft-page', params: [notification.videoId] },
        avatar: { type: 'channel', params: [notification.channelId] },
        text: (
          <>
            {notification.channelTitle} started an auction for NFT: “{notification.videoTitle}”
          </>
        ),
      }

    // NFT
    case 'HigherBidPlaced':
      return {
        icon: 'nft-alt',
        action: { type: 'nft-page', params: [notification.videoId] },
        avatar: { type: 'membership', params: [notification.newBidderHandle] },
        text: (
          <>
            {notification.newBidderHandle} placed a higher bid in the auction for NFT: “{notification.videoTitle}”
          </>
        ),
      }
    case 'AuctionWon': {
      const auctionText = notification.auction === 'AuctionTypeOpen' ? 'an open' : 'a timed'
      return {
        icon: 'nft',
        action: { type: 'nft-page', params: [notification.videoId] },
        avatar: { type: 'active-membership' },
        text: (
          <>
            You won {auctionText} auction for NFT: “{notification.videoTitle}”
          </>
        ),
      }
    }
    case 'AuctionLost': {
      const auctionText = notification.auction === 'AuctionTypeOpen' ? 'an open' : 'a timed'
      return {
        icon: 'nft-alt',
        action: { type: 'nft-page', params: [notification.videoId] },
        avatar: { type: 'active-membership' },
        text: (
          <>
            You lost {auctionText} auction for NFT: “{notification.videoTitle}”. Withdraw your bid
          </>
        ),
      }
    }
    // case 'NFT bid becomes withdrawable (for bidder)': // MISSING
    //   return {
    //     icon: 'nft',
    //     action: { type: 'video-page-nft', params: [notification.videoId] },
    //     avatar: { type: 'current-membership', value: '' },
    //     text: <>Your bid is withdrawable for NFT: “{notification.videoTitle}”</>,
    //   }

    // Payouts
    // case 'Funds received': // MISSING
    //   return {
    //    icon: 'payout',
    //     avatar: { type: 'channel', params: [notification.channelId] },
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
    //     icon: 'payout',
    //     avatar: { type: 'channel', params: [notification.channelId] },
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
    //     icon: 'payout',
    //     avatar: { type: 'channel', params: [notification.channelId] },
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
        icon: 'warning',
        action: { type: 'term-of-sevice-page' },
        avatar: { type: 'active-channel' },
        text: <>Your channel “{channelTitle}” is excluded from App</>,
      }
    case 'VideoExcluded':
      return {
        icon: 'warning',
        action: { type: 'term-of-sevice-page' },
        avatar: { type: 'active-channel' },
        text: <>Your video is excluded from App: “{notification.videoTitle}”</>,
      }
    case 'NftFeaturedOnMarketPlace':
      return {
        icon: 'bell',
        action: { type: 'marketplace-page' },
        avatar: { type: 'active-channel' },
        text: <>Your NFT was featured in the marketplace featured section: “{notification.videoTitle}”</>,
      }

    // Engagement
    case 'NewChannelFollower':
      return {
        icon: 'follow',
        action: { type: 'member-page', params: [notification.followerHandle] },
        avatar: { type: 'membership', params: [notification.followerHandle] },
        text: <>{notification.followerHandle} followed your channel</>,
      }
    case 'CommentPostedToVideo':
      return {
        icon: 'follow',
        action: { type: 'nft-page', params: [notification.videoId] },
        avatar: { type: 'membership', params: [notification.memberHandle] },
        text: (
          <>
            {notification.memberHandle} left a comment on your video: “{notification.videoTitle}”
          </>
        ),
      }
    case 'VideoLiked':
      return {
        icon: 'like',
        action: { type: 'video-page', params: [notification.videoId] },
        avatar: { type: 'membership', params: [notification.memberHandle] },
        text: (
          <>
            {notification.memberHandle} liked your video: “{notification.videoTitle}”
          </>
        ),
      }
    case 'VideoDisliked':
      return {
        icon: 'dislike',
        action: { type: 'video-page', params: [notification.videoId] },
        avatar: { type: 'membership', params: [notification.memberHandle] },
        text: (
          <>
            {notification.memberHandle} disliked your video: “{notification.videoTitle}”
          </>
        ),
      }

    // Youtube Partnership Program
    // case 'YPP sign up successful': // MISSING
    //   return {
    //     icon: 'bell',
    //     action: { type: 'ypp-dashboard' },
    //     avatar: { type: 'current-channel', value: '' },
    //     text: <>Your channel was successfully signed up for Youtube Partnership Program</>,
    //   }
    // case 'Someone signed up using your referral link': // MISSING
    //   return {
    //     icon: 'bell',
    //     action: { type: 'ypp-dashboard' },
    //     avatar: { type: 'membership', params: [notification.memberHandle] },
    //     text: <>{notification.memberHandle} signed up for YPP using your referral link</>,
    //   }
    case 'ChannelVerified':
      return {
        icon: 'bell',
        action: { type: 'ypp-dashboard' },
        avatar: { type: 'active-channel' },
        text: <>Your channel got verified in our Youtube Partnership Program</>,
      }
    case 'ChannelSuspended':
      return {
        icon: 'warning',
        action: { type: 'ypp-dashboard' },
        avatar: { type: 'active-channel' },
        text: <>Your channel got suspended in our Youtube Partnership Program</>,
      }

    // NFTs Auctions
    case 'NftPurchased':
      return {
        icon: 'nft',
        action: { type: 'nft-page', params: [notification.videoId] },
        avatar: { type: 'membership', params: [notification.buyerHandle] },
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
        icon: 'nft',
        action: { type: 'nft-page', params: [notification.videoId] },
        avatar: { type: 'active-channel' },
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
        icon: 'nft',
        action: { type: 'nft-page', params: [notification.videoId] },
        avatar: { type: 'membership', params: [notification.bidderHandle] },
        text: (
          <>
            {notification.bidderHandle} placed a bid of{' '}
            <NumberFormat as="span" value={notification.amount} format="short" withToken withDenomination="before" />{' '}
            for your NFT: “{notification.videoTitle}”
          </>
        ),
      }
    // case 'EnglishAuctionSettled': // MISSING (v2)
    //   return {
    //     icon: 'nft',
    //     action: { type: 'nft-page', params: [notification.videoId] },
    //     avatar: { type: 'active-channel' },
    //     text: <>Timed auction expired on your NFT: “{notification.videoTitle}”</>,
    //   }

    // Payouts
    case 'DirectChannelPaymentByMember':
      return {
        icon: 'payout',
        action: { type: 'member-page', params: [notification.payerHandle] },
        avatar: { type: 'membership', params: [notification.payerHandle] },
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
    //     icon: 'payout',
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
        icon: 'payout',
        action: { type: 'payments-page' },
        avatar: { type: 'active-membership' },
        text: (
          <>
            <NumberFormat as="span" value={notification.amount} format="short" withToken withDenomination="before" />{' '}
            were withdrawn from your channel account
          </>
        ),
      }
  }
}
