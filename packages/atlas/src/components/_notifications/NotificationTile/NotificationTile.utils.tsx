import { ReactElement, ReactNode, useMemo } from 'react'

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
import { relativeRoutes } from '@/config/routes'
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
): { avatarUrls?: string[]; isLoading: boolean } => {
  const { activeChannel, activeMembership } = useUser()

  const memberHandle = avatar?.type === 'membership' ? avatar.value : undefined
  const { data: memberData, loading: isMemberLoading } = useGetMembershipsAvatarQuery({
    variables: { where: { handle_eq: memberHandle }, limit: 1 },
    skip: !memberHandle,
  })
  const member = avatar?.type === 'active-membership' ? activeMembership : memberData?.memberships[0]

  const channelId = avatar?.type === 'channel' ? avatar.value : undefined
  const { data: channelData, loading: isChannelLoading } = useGetChannelAvatarQuery({
    variables: { id: channelId ?? '' },
    skip: !channelId,
  })
  const channel = avatar?.type === 'active-channel' ? activeChannel : channelData?.channelById

  switch (avatar?.type) {
    case undefined:
      return { isLoading: false }

    case 'active-membership':
    case 'membership':
      return { avatarUrls: getMemberAvatar(member).urls ?? undefined, isLoading: isMemberLoading }

    case 'active-channel':
    case 'channel':
      if (!channel?.avatarPhoto?.isAccepted === false) {
        return { isLoading: false }
      }
      return { avatarUrls: channel?.avatarPhoto?.resolvedUrls, isLoading: isChannelLoading }
  }
}

// TODO make the avatar field required too
type NotificationUX = {
  icon: NotificationIconType
  action: { link?: string; onClick?: () => void }
  avatar?: { type: NotificationAvatarType; value: string }
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
        action: { link: relativeRoutes.viewer.channel(notification.channelId) },
        avatar: { type: 'channel', value: notification.channelId },
        text: <>New channel created: “{notification.channelTitle}“</>,
      }

    // Engagement
    case 'CommentReply':
      return {
        icon: 'follow',
        action: { link: relativeRoutes.viewer.video(notification.videoId) }, // REPLY ID MISSING
        avatar: { type: 'membership', value: notification.memberHandle },
        text: (
          <>
            {notification.memberHandle} replied to your commend under video: “{notification.videoTitle}”
          </>
        ),
      }
    case 'ReactionToComment':
      return {
        icon: 'reaction',
        action: { link: relativeRoutes.viewer.video(notification.videoId) }, // COMMENT ID MISSING
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
        icon: 'video',
        action: { link: relativeRoutes.viewer.video(notification.videoId) },
        // avatar: { type: 'channel', value: notification.channelId }, // AVATAR MISSING
        text: (
          <>
            {notification.channelTitle} posted a new video: “{notification.videoTitle}”
          </>
        ),
      }
    case 'NewNftOnSale':
      return {
        icon: 'nft',
        action: { link: relativeRoutes.viewer.video(notification.videoId) }, // TODO with NFT widget opened
        // avatar: { type: 'channel', value: notification.channelId }, // AVATAR MISSING
        text: (
          <>
            {notification.channelTitle} started the sale of NFT: “{notification.videoTitle}”
          </>
        ),
      }
    case 'NewAuction':
      return {
        icon: 'nft',
        action: { link: relativeRoutes.viewer.video(notification.videoId) }, // TODO with NFT widget opened
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
        icon: 'nft-alt',
        action: { link: relativeRoutes.viewer.video(notification.videoId) }, // TODO with NFT widget opened
        avatar: { type: 'membership', value: notification.newBidderHandle },
        text: (
          <>
            {notification.newBidderHandle} placed a higher bid in the auction for NFT: “{notification.videoTitle}”
          </>
        ),
      }
    case 'EnglishAuctionWon':
      return {
        icon: 'nft',
        action: { link: relativeRoutes.viewer.video(notification.videoId) }, // TODO with NFT widget opened
        avatar: { type: 'active-membership', value: '' },
        text: <>You won a timed auction for NFT: “{notification.videoTitle}”</>,
      }
    case 'EnglishAuctionLost':
      return {
        icon: 'nft-alt',
        action: { link: relativeRoutes.viewer.video(notification.videoId) }, // TODO with NFT widget opened
        avatar: { type: 'active-membership', value: '' },
        text: <>You lost a timed auction for NFT: “{notification.videoTitle}”</>,
      }
    case 'OpenAuctionWon':
      return {
        icon: 'nft',
        action: { link: relativeRoutes.viewer.video(notification.videoId) }, // TODO with NFT widget opened
        avatar: { type: 'active-membership', value: '' },
        text: <>You won an open auction for NFT: “{notification.videoTitle}”</>,
      }
    case 'OpenAuctionLost':
      return {
        icon: 'nft-alt',
        action: { link: relativeRoutes.viewer.video(notification.videoId) }, // TODO with NFT widget opened
        avatar: { type: 'active-membership', value: '' },
        text: <>You lost an open auction for NFT: “{notification.videoTitle}”</>,
      }
    // case 'NFT bid becomes withdrawable (for bidder)': // MISSING
    //   return {
    //     icon: 'nft',
    //     link: relativeRoutes.viewer.video(notification.videoId), // TODO with NFT widget opened
    //     avatar: { type: 'current-membership', value: '' },
    //     text: <>Your bid is withdrawable for NFT: “{notification.videoTitle}”</>,
    //   }

    // Payouts
    // case 'Funds received': // MISSING
    //   return {
    //    icon: 'payout',
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
    //     icon: 'payout',
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
    //     icon: 'payout',
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
        icon: 'warning',
        action: { link: relativeRoutes.legal.termsOfService() },
        avatar: { type: 'active-channel', value: '' },
        text: <>Your channel “{channelTitle}” is excluded from App</>,
      }
    case 'VideoExcluded':
      return {
        icon: 'warning',
        action: { link: relativeRoutes.legal.termsOfService() },
        avatar: { type: 'active-channel', value: '' },
        text: <>Your video is excluded from App: “{notification.videoTitle}”</>,
      }
    case 'VideoFeaturedOnCategoryPage':
      return {
        icon: 'bell',
        action: { link: relativeRoutes.viewer.category(notification.categoryId) },
        avatar: { type: 'active-channel', value: '' },
        text: (
          <>
            Your video was featured on the “{notification.categoryName}” category page: “{notification.videoTitle}”
          </>
        ),
      }
    case 'NftFeaturedOnMarketPlace':
      return {
        icon: 'bell',
        action: { link: relativeRoutes.viewer.marketplace() },
        avatar: { type: 'active-channel', value: '' },
        text: <>Your NFT was featured in the marketplace featured section: “{notification.videoTitle}”</>,
      }
    case 'VideoFeaturedAsCategoryHero':
      return {
        icon: 'bell',
        action: { link: relativeRoutes.viewer.category(notification.categoryId) },
        avatar: { type: 'active-channel', value: '' },
        text: (
          <>
            “{notification.categoryName}” category page featured your video as the category hero video: “
            {notification.videoTitle}”
          </>
        ),
      }

    // Engagement
    case 'NewChannelFollower':
      return {
        icon: 'follow',
        action: { link: relativeRoutes.viewer.member(notification.followerHandle) },
        avatar: { type: 'membership', value: notification.followerHandle },
        text: <>{notification.followerHandle} followed your channel</>,
      }
    case 'CommentPostedToVideo':
      return {
        icon: 'follow',
        action: { link: relativeRoutes.viewer.video(notification.videoId) }, // TODO with NFT widget opened
        avatar: { type: 'membership', value: notification.memberHandle },
        text: (
          <>
            {notification.memberHandle} left a comment on your video: “{notification.videoTitle}”
          </>
        ),
      }
    case 'VideoLiked':
      return {
        icon: 'like',
        action: { link: relativeRoutes.viewer.video(notification.videoId) },
        // avatar: { type: 'membership', value: notification.memberHandle }, // AVATAR MISSING
        text: (
          <>
            {/*notification.memberHandle*/ 'Someone'} liked your video: “{notification.videoTitle}”
          </>
        ),
      }
    case 'VideoDisliked':
      return {
        icon: 'dislike',
        action: { link: relativeRoutes.viewer.video(notification.videoId) },
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
    //     icon: 'bell',
    //     link: relativeRoutes.viewer.yppDashboard(),
    //     avatar: { type: 'current-channel', value: '' },
    //     text: <>Your channel was successfully signed up for Youtube Partnership Program</>,
    //   }
    // case 'Someone signed up using your referral link': // MISSING
    //   return {
    //     icon: 'bell',
    //     link: relativeRoutes.viewer.yppDashboard(), // TODO with referral tab open
    //     avatar: { type: 'membership', value: notification.memberHandle },
    //     text: <>{notification.memberHandle} signed up for YPP using your referral link</>,
    //   }
    case 'ChannelVerified':
      return {
        icon: 'bell',
        action: { link: relativeRoutes.viewer.yppDashboard() },
        avatar: { type: 'active-channel', value: '' },
        text: <>Your channel got verified in our Youtube Partnership Program</>,
      }
    case 'ChannelSuspended':
      return {
        icon: 'warning',
        action: { link: relativeRoutes.viewer.yppDashboard() },
        avatar: { type: 'active-channel', value: '' },
        text: <>Your channel got suspended in our Youtube Partnership Program</>,
      }

    // NFTs Auctions
    case 'NftPurchased':
      return {
        icon: 'nft',
        action: { link: relativeRoutes.viewer.video(notification.videoId) }, // TODO with NFT widget opened
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
        icon: 'nft',
        action: { link: relativeRoutes.viewer.video(notification.videoId) }, // TODO with NFT widget opened
        avatar: { type: 'active-channel', value: '' },
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
        action: { link: relativeRoutes.viewer.video(notification.videoId) }, // TODO with NFT widget opened
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
        icon: 'nft',
        action: { link: relativeRoutes.viewer.video(notification.videoId) }, // TODO with NFT widget opened
        avatar: { type: 'active-channel', value: '' },
        text: <>Timed auction expired on your NFT: “{notification.videoTitle}”</>,
      }

    // Payouts
    case 'DirectChannelPaymentByMember':
      return {
        icon: 'payout',
        action: { link: relativeRoutes.viewer.member(notification.payerHandle) },
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
        action: { onClick: () => undefined }, // TODO implement "open channel dropdown"
        avatar: { type: 'active-membership', value: '' },
        text: (
          <>
            <NumberFormat as="span" value={notification.amount} format="short" withToken withDenomination="before" />{' '}
            transferred from your channel to your membership account
          </>
        ),
      }
  }
}
