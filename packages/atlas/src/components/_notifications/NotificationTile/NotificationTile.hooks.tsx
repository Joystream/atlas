import BN from 'bn.js'
import { ReactElement, ReactNode, useMemo } from 'react'

import { useGetChannelAvatarQuery } from '@/api/queries/__generated__/channels.generated'
import { useGetMembershipsAvatarQuery } from '@/api/queries/__generated__/memberships.generated'
import {
  SvgActionAddVideo,
  SvgActionCouncil,
  SvgActionCreatorToken,
  SvgActionDislikeOutline,
  SvgActionInformative,
  SvgActionLikeOutline,
  SvgActionNft,
  SvgActionNotifications,
  SvgActionPlaceholder,
  SvgActionRevenueShare,
} from '@/assets/icons'
import { NumberFormat } from '@/components/NumberFormat'
import { ChannelTabs, CrtDashboardTabs, absoluteRoutes } from '@/config/routes'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useJoystreamStore } from '@/providers/joystream/joystream.store'
import { NotificationRecord } from '@/providers/notifications/notifications.types'
import { useUser } from '@/providers/user/user.hooks'
import { formatNumber } from '@/utils/number'
import { formatDateTimeAt } from '@/utils/time'

import { IconContainer } from './NotificationTile.styles'

type NotificationAvatarType = 'active-channel' | 'active-membership' | 'channel' | 'membership'

export const useNotificationAvatar = (
  avatar: NotificationUX['avatar']
): { avatarUrls: string[]; isLoading: boolean } => {
  const { activeChannel, activeMembership } = useUser()

  const memberId = avatar.type === 'membership' ? avatar.params?.[0] : undefined
  const { data: memberData, loading: isMemberLoading } = useGetMembershipsAvatarQuery({
    variables: { where: { id_eq: memberId }, limit: 1 },
    skip: !memberId,
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

type NotificationUX = {
  icon: ReactNode
  link: string
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
    case 'ChannelCreated': {
      const { channelId, channelTitle } = notification
      return {
        icon: getIcon('bell'),
        link: getLink('channel-page', [channelId]),
        avatar: { type: 'channel', params: [channelId] },
        text: <div>New channel created: “{channelTitle}“</div>,
      }
    }

    // Engagement
    case 'CommentReply': {
      const { videoId, videoTitle, commentId, memberId, memberHandle } = notification
      return {
        icon: getIcon('follow'),
        link: getLink('video-page', [videoId, commentId]),
        avatar: { type: 'membership', params: [memberId] },
        text: (
          <div>
            {memberHandle} replied to your comment under the video: “{videoTitle}”
          </div>
        ),
      }
    }
    case 'ReactionToComment': {
      const { videoId, videoTitle, commentId, memberId, memberHandle } = notification
      return {
        icon: getIcon('reaction'),
        link: getLink('video-page', [videoId, commentId]),
        avatar: { type: 'membership', params: [memberId] },
        text: (
          <div>
            {memberHandle} reacted to your comment on the video: “{videoTitle}”
          </div>
        ),
      }
    }

    // Followed channels
    case 'VideoPosted': {
      const { videoId, videoTitle, channelTitle, channelId } = notification
      return {
        icon: getIcon('video'),
        link: getLink('video-page', [videoId]),
        avatar: { type: 'channel', params: [channelId] },
        text: (
          <div>
            {channelTitle} posted a new video: “{videoTitle}”
          </div>
        ),
      }
    }
    case 'NewNftOnSale': {
      const { videoId, videoTitle, channelTitle, channelId } = notification
      return {
        icon: getIcon('nft'),
        link: getLink('nft-page', [videoId]),
        avatar: { type: 'channel', params: [channelId] },
        text: (
          <div>
            {channelTitle} started the sale of NFT: “{videoTitle}”
          </div>
        ),
      }
    }
    case 'NewAuction': {
      const { videoId, videoTitle, channelTitle, channelId } = notification
      return {
        icon: getIcon('nft'),
        link: getLink('nft-page', [videoId]),
        avatar: { type: 'channel', params: [channelId] },
        text: (
          <div>
            {channelTitle} started an auction for NFT: “{videoTitle}”
          </div>
        ),
      }
    }

    // NFT
    case 'HigherBidPlaced': {
      const { videoId, videoTitle, newBidderId, newBidderHandle } = notification
      return {
        icon: getIcon('nft-alt'),
        link: getLink('nft-page', [videoId]),
        avatar: { type: 'membership', params: [newBidderId] },
        text: (
          <div>
            {newBidderHandle} placed a higher bid in the auction for NFT: “{videoTitle}”
          </div>
        ),
      }
    }
    case 'AuctionWon': {
      const { videoId, videoTitle, auction } = notification
      const auctionText = auction === 'AuctionTypeOpen' ? 'an open' : 'a timed'
      return {
        icon: getIcon('nft'),
        link: getLink('nft-page', [videoId]),
        avatar: { type: 'active-membership' },
        text: (
          <div>
            You won {auctionText} auction for NFT: “{videoTitle}”
          </div>
        ),
      }
    }
    case 'AuctionLost': {
      const { videoId, videoTitle, auction } = notification
      const auctionText = auction === 'AuctionTypeOpen' ? 'an open' : 'a timed'
      return {
        icon: getIcon('nft-alt'),
        link: getLink('nft-page', [videoId]),
        avatar: { type: 'active-membership' },
        text: (
          <div>
            You lost {auctionText} auction for NFT: “{videoTitle}”. Withdraw your bid
          </div>
        ),
      }
    }
    // case 'NFT bid becomes withdrawable (for bidder)': // MISSING
    //   return {
    //     icon: notificationIcon('nft'),
    //     action: { type: 'video-page-nft', params: [notification.videoId] },
    //     avatar: { type: 'current-membership', value: '' },
    //     text: <div>Your bid is withdrawable for NFT: “{notification.videoTitle}”</div>,
    //   }

    // Payouts
    // case 'Funds received': // MISSING
    //   return {
    //    icon: notificationIcon('payout'),
    //     avatar: { type: 'channel', params: [notification.channelId] },
    //     text: (
    //       <div>
    //         You have received{' '}
    //         <NumberFormat as="span" value={notification.amount} format="short" withToken withDenomination="before" />{' '}
    //         for your channel “{notification.channelTitle}” from Council Payout proposal
    //       </div>
    //     ),
    //   }
    // case 'Funds sent': // MISSING
    //   return {
    //     icon: notificationIcon('payout'),
    //     avatar: { type: 'channel', params: [notification.channelId] },
    //     text: (
    //       <div>
    //         You transferred{' '}
    //         <NumberFormat as="span" value={notification.amount} format="short" withToken withDenomination="before" />{' '}
    //         from you member wallet to external wallet: {notification.walletaddress}
    //       </div>
    //     ),
    //   }
    // case 'Member received transfer from DAO WG': // MISSING
    //   return {
    //     icon: notificationIcon('payout'),
    //     avatar: { type: 'channel', params: [notification.channelId] },
    //     text: (
    //       <div>
    //         You have received{' '}
    //         <NumberFormat as="span" value={notification.amount} format="short" withToken withDenomination="before" />{' '}
    //         from “{notification.group}” working group
    //       </div>
    //     ),
    //   }

    //
    // Channel notifications events
    //

    // Content moderation and featuring
    case 'ChannelExcluded': {
      return {
        icon: getIcon('warning'),
        link: getLink('term-of-sevice-page'),
        avatar: { type: 'active-channel' },
        text: <div>Your channel “{channelTitle}” is excluded from App</div>,
      }
    }
    case 'VideoExcluded': {
      const { videoTitle } = notification
      return {
        icon: getIcon('warning'),
        link: getLink('term-of-sevice-page'),
        avatar: { type: 'active-channel' },
        text: <div>Your video is excluded from App: “{videoTitle}”</div>,
      }
    }
    case 'NftFeaturedOnMarketPlace': {
      const { videoTitle } = notification
      return {
        icon: getIcon('bell'),
        link: getLink('marketplace-page'),
        avatar: { type: 'active-channel' },
        text: <div>Your NFT was featured in the marketplace featured section: “{videoTitle}”</div>,
      }
    }

    // Engagement
    case 'NewChannelFollower': {
      const { followerId, followerHandle } = notification
      return {
        icon: getIcon('follow'),
        link: getLink('member-page', [followerId]),
        avatar: { type: 'membership', params: [followerId] },
        text: <div>{followerHandle} followed your channel</div>,
      }
    }
    case 'CommentPostedToVideo': {
      const { videoId, videoTitle, memberId, memberHandle } = notification
      return {
        icon: getIcon('follow'),
        link: getLink('nft-page', [videoId]),
        avatar: { type: 'membership', params: [memberId] },
        text: (
          <div>
            {memberHandle} left a comment on your video: “{videoTitle}”
          </div>
        ),
      }
    }
    case 'VideoLiked': {
      const { videoId, videoTitle, memberId, memberHandle } = notification
      return {
        icon: getIcon('like'),
        link: getLink('video-page', [videoId]),
        avatar: { type: 'membership', params: [memberId] },
        text: (
          <div>
            {memberHandle} liked your video: “{videoTitle}”
          </div>
        ),
      }
    }
    case 'VideoDisliked': {
      const { videoId, videoTitle, memberId, memberHandle } = notification
      return {
        icon: getIcon('dislike'),
        link: getLink('video-page', [videoId]),
        avatar: { type: 'membership', params: [memberId] },
        text: (
          <div>
            {memberHandle} disliked your video: “{videoTitle}”
          </div>
        ),
      }
    }

    // YouTube Partnership Program
    // case 'YPP sign up successful': // MISSING
    //   return {
    //     icon: notificationIcon('bell'),
    //     action: { type: 'ypp-dashboard' },
    //     avatar: { type: 'current-channel', value: '' },
    //     text: <div>Your channel was successfully signed up for YouTube Partnership Program</div>,
    //   }
    // case 'Someone signed up using your referral link': // MISSING
    //   return {
    //     icon: notificationIcon('bell'),
    //     action: { type: 'ypp-dashboard' },
    //     avatar: { type: 'membership', params: [notification.memberId] },
    //     text: <div>{notification.memberHandle} signed up for YPP using your referral link</div>,
    //   }
    case 'ChannelVerified': {
      return {
        icon: getIcon('bell'),
        link: getLink('ypp-dashboard'),
        avatar: { type: 'active-channel' },
        text: <div>Your channel got verified in our YouTube Partnership Program</div>,
      }
    }
    case 'ChannelSuspended': {
      return {
        icon: getIcon('warning'),
        link: getLink('ypp-dashboard'),
        avatar: { type: 'active-channel' },
        text: <div>Your channel got suspended in our YouTube Partnership Program</div>,
      }
    }

    // NFTs Auctions
    case 'NftPurchased': {
      const { videoId, videoTitle, buyerId, buyerHandle, price } = notification
      const tokenAmount = <NumberFormat as="span" value={price} format="short" withToken withDenomination="before" />
      return {
        icon: getIcon('nft'),
        link: getLink('nft-page', [videoId]),
        avatar: { type: 'membership', params: [buyerId] },
        text: (
          <div>
            {buyerHandle} purchased for {tokenAmount} your NFT: “{videoTitle}”
          </div>
        ),
      }
    }
    case 'NftRoyaltyPaid': {
      const { videoId, videoTitle, amount } = notification
      const tokenAmount = <NumberFormat as="span" value={amount} format="short" withToken withDenomination="before" />
      return {
        icon: getIcon('nft'),
        link: getLink('nft-page', [videoId]),
        avatar: { type: 'active-channel' },
        text: (
          <div>
            You received {tokenAmount} royalties from your NFT: {videoTitle}”
          </div>
        ),
      }
    }
    case 'CreatorReceivesAuctionBid': {
      const { videoId, videoTitle, amount, bidderId, bidderHandle } = notification
      const tokenAmount = <NumberFormat as="span" value={amount} format="short" withToken withDenomination="before" />
      return {
        icon: getIcon('nft'),
        link: getLink('nft-page', [videoId]),
        avatar: { type: 'membership', params: [bidderId] },
        text: (
          <div>
            {bidderHandle} placed a bid of {tokenAmount} for your NFT: “{videoTitle}”
          </div>
        ),
      }
    }
    // case 'EnglishAuctionSettled': // MISSING (v2)
    //   return {
    //     icon: notificationIcon('nft'),
    //     action: { type: 'nft-page', [notification.videoId] },
    //     avatar: { type: 'active-channel' },
    //     text: <div>Timed auction expired on your NFT: “{notification.videoTitle}”</div>,
    //   }

    // Payouts
    case 'DirectChannelPaymentByMember': {
      const { amount, payerId, payerHandle } = notification
      const tokenAmount = <NumberFormat as="span" value={amount} format="short" withToken withDenomination="before" />
      return {
        icon: getIcon('payout'),
        link: getLink('member-page', [payerId]),
        avatar: { type: 'membership', params: [payerId] },
        text: (
          <div>
            {payerHandle} transferred {tokenAmount} to your channel
          </div>
        ),
      }
    }
    // case 'Channel received transfer from WG': // MISSING
    //   return {
    //     icon: notificationIcon('payout'),
    //     avatar: { type: 'current-channel', value: '' },
    //     text: (
    //       <div>
    //         You have received{' '}
    //         <NumberFormat as="span" value={notification.amount} format="short" withToken withDenomination="before" />{' '}
    //         from “marketing” working group
    //       </div>
    //     ),
    //   }
    // case 'New payout is claimable from Council Payout proposal': // MISSING
    //   return {
    //     avatar: { type: 'current-channel', value: '' },
    //     text: (
    //       <div>
    //         You have{' '}
    //         <NumberFormat as="span" value={notification.amount} format="short" withToken withDenomination="before" /> to
    //         claim from Council Payout proposal
    //       </div>
    //     ),
    //   }
    case 'ChannelFundsWithdrawn': {
      const { amount } = notification
      const tokenAmount = <NumberFormat as="span" value={amount} format="short" withToken withDenomination="before" />
      return {
        icon: getIcon('payout'),
        link: getLink('payments-page'),
        avatar: { type: 'active-membership' },
        text: <div>{tokenAmount} were withdrawn from your channel account</div>,
      }
    }

    // CRTs

    case 'CreatorTokenIssued': {
      const { channelId, channelTitle, tokenSymbol } = notification
      return {
        icon: getIcon('crt'),
        link: getLink('channel-page', [channelId, 'Token']),
        avatar: { type: 'channel', params: [channelId] },
        text: (
          <div>
            {channelTitle} issued a creator token for their channel called ${tokenSymbol}.
          </div>
        ),
      }
    }
    case 'CreatorTokenMarketStarted': {
      const { channelId, channelTitle, tokenSymbol } = notification
      return {
        icon: getIcon('crt'),
        link: getLink('channel-page', [channelId, 'Token']),
        avatar: { type: 'channel', params: [channelId] },
        text: (
          <div>
            {channelTitle} started a market for ${tokenSymbol} token.{' '}
          </div>
        ),
      }
    }
    case 'CreatorTokenSaleStarted': {
      const { channelId, channelTitle, tokenSymbol } = notification
      return {
        icon: getIcon('crt'),
        link: getLink('channel-page', [channelId, 'Token']),
        avatar: { type: 'channel', params: [channelId] },
        text: (
          <div>
            {channelTitle} started a sale of ${tokenSymbol} token.{' '}
          </div>
        ),
      }
    }
    case 'CreatorTokenRevenueSharePlanned': {
      const { channelId, channelTitle, tokenSymbol, plannedAt } = notification
      return {
        icon: getIcon('crt'),
        link: getLink('channel-page', [channelId, 'Token']),
        avatar: { type: 'channel', params: [channelId] },
        text: (
          <div>
            {channelTitle} planned revenue share for ${tokenSymbol} token starting at: {formatDateTimeAt(plannedAt)}.
          </div>
        ),
      }
    }
    case 'CreatorTokenRevenueShareStarted': {
      const { channelId, channelTitle, tokenSymbol } = notification
      return {
        icon: getIcon('crt'),
        link: getLink('channel-page', [channelId, 'Token']),
        avatar: { type: 'channel', params: [channelId] },
        text: (
          <div>
            {channelTitle} started a revenue share for ${tokenSymbol} token. Go and claim your share now!{' '}
          </div>
        ),
      }
    }
    case 'CreatorTokenRevenueShareEnded': {
      const { channelId, channelTitle, tokenSymbol } = notification
      return {
        icon: getIcon('crt'),
        link: getLink('channel-page', [channelId, 'Token']),
        avatar: { type: 'channel', params: [channelId] },
        text: (
          <div>
            {channelTitle} ended a revenue share for ${tokenSymbol} token. Unlock your locked tokens!{' '}
          </div>
        ),
      }
    }
    case 'CreatorTokenMarketMint':
    case 'CreatorTokenSaleMint': {
      const { mintedTokenAmount, tokenSymbol, minterHandle, paiedJoyAmount, minterId } = notification
      const { sessionTokenPrice } = useJoystreamStore.getState()
      const joyValue = hapiBnToTokenNumber(new BN(paiedJoyAmount), true)
      return {
        icon: getIcon('crt'),
        link: getLink('crt-dashboard', [notification.type === 'CreatorTokenMarketMint' ? 'Market' : 'Sale']),
        avatar: { type: 'membership', params: [minterId] },
        text: (
          <div>
            {minterHandle} purchased {mintedTokenAmount} ${tokenSymbol} on token{' '}
            {notification.type === 'CreatorTokenMarketMint' ? 'market' : 'sale'} for ($
            {sessionTokenPrice ? formatNumber(joyValue * sessionTokenPrice) : '-'}) {joyValue} $JOY{' '}
          </div>
        ),
      }
    }
    case 'CreatorTokenMarketBurn': {
      const { burnedTokenAmount, tokenSymbol, burnerHandle, receivedJoyAmount, burnerId } = notification
      const { sessionTokenPrice } = useJoystreamStore.getState()
      const joyValue = hapiBnToTokenNumber(new BN(receivedJoyAmount), true)

      return {
        icon: getIcon('crt'),
        link: getLink('crt-dashboard', ['Market']),
        avatar: { type: 'membership', params: [burnerId] },
        text: (
          <div>
            {burnerHandle} sold {burnedTokenAmount} ${tokenSymbol} on token market for ($
            {sessionTokenPrice ? formatNumber(joyValue * sessionTokenPrice) : '-'}) {joyValue} $JOY{' '}
          </div>
        ),
      }
    }
  }
}

type NotificationIconType =
  | 'crt'
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

const notificationIconMapper: Record<NotificationIconType, [ReactElement, 'red' | 'blue' | 'green' | 'gray']> = {
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
  crt: [<SvgActionCreatorToken key={1} />, 'green'],
}

const getIcon = (iconType: NotificationIconType) => {
  const [icon, color] = notificationIconMapper[iconType]
  return (
    <IconContainer className="notification-icon-container" color={color}>
      {icon}
    </IconContainer>
  )
}

type LinkType =
  | 'video-page'
  | 'nft-page'
  | 'channel-page'
  | 'term-of-sevice-page'
  | 'category-page'
  | 'marketplace-page'
  | 'member-page'
  | 'ypp-dashboard'
  | 'payments-page'
  | 'crt-dashboard'

const getLink = (type: LinkType, params: string[] = []): string => {
  switch (type) {
    case 'video-page':
      return absoluteRoutes.viewer.video(params[0], { commentId: params[1] })

    case 'nft-page':
      return absoluteRoutes.viewer.video(params[0], { nftWidget: true })

    case 'channel-page':
      return absoluteRoutes.viewer.channel(params[0], { tab: params[1] as ChannelTabs })

    case 'member-page':
      return absoluteRoutes.viewer.memberById(params[0])

    case 'category-page':
      return absoluteRoutes.viewer.category(params[0])

    case 'marketplace-page':
      return absoluteRoutes.viewer.marketplace()

    case 'payments-page':
      return absoluteRoutes.studio.payments()

    case 'crt-dashboard':
      return absoluteRoutes.studio.crtDashboard({ tab: params[0] as CrtDashboardTabs })

    case 'ypp-dashboard':
      return absoluteRoutes.viewer.yppDashboard()

    case 'term-of-sevice-page':
      return absoluteRoutes.legal.termsOfService()
  }
}
