import {
  errorAnimation,
  processingAssetsAnimation,
  processingTransactionAnimation,
  propagatingChangesAnimation,
  signatureAnimation,
} from '@/assets/animations'
import '@/config/config'
import { ErrorCode } from '@/joystream-lib/errors'
import { ExtrinsicStatus } from '@/joystream-lib/types'

// load and parse app config

export const getExtrinsicStatusDetails = (
  status: ExtrinsicStatus,
  errorCode?: ErrorCode | null,
  walletName = 'Polkadot'
) => {
  switch (status) {
    case ExtrinsicStatus.ProcessingAssets:
      return {
        title: 'Processing your assets',
        description:
          "Please wait till all your assets get processed. This can take up to 1 minute, depending on asset size and your machine's computing power.",
        animation: {
          data: processingAssetsAnimation,
          size: {
            width: 216,
            height: 216,
          },
          loop: true,
        },
      }
    case ExtrinsicStatus.Unsigned:
      return {
        title: 'Waiting for your signature',
        description: `Please sign the transaction using the ${walletName} wallet.`,
        animation: {
          data: signatureAnimation,
          size: {
            width: 288,
            height: 216,
          },
          loop: false,
        },
      }
    case ExtrinsicStatus.Signed:
      return {
        title: 'Processing transaction',
        description:
          'Your transaction has been signed and sent. Please wait for the blockchain confirmation. This should take about 15 seconds.',
        animation: {
          data: processingTransactionAnimation,
          size: {
            width: 216,
            height: 216,
          },
          loop: true,
        },
      }
    case ExtrinsicStatus.Syncing:
      return {
        title: 'Propagating changes',
        description:
          "Your transaction has been accepted and included into the blockchain. Please wait till it's picked up by the indexing node. This should take up to 15 seconds.",
        animation: {
          data: propagatingChangesAnimation,
          size: {
            width: 144,
            height: 144,
          },
          loop: true,
        },
      }
    case ExtrinsicStatus.Error: {
      const sharedTitle = 'Something went wrong...'
      const sharedAnimation = {
        data: errorAnimation,
        size: {
          width: 288,
          height: 264,
        },
        loop: false,
      }

      switch (errorCode) {
        case ErrorCode.NftAuctionIsAlreadyExpired:
          return {
            title: sharedTitle,
            description: "This auction has already expired. Your bid wasn't accepted.",
            animation: sharedAnimation,
          }
        case ErrorCode.ActionHasBidsAlready:
          return {
            title: sharedTitle,
            description: 'You cannot cancel this auction because somebody has already placed a bid on it.',
            animation: sharedAnimation,
          }
        case ErrorCode.ActorNotAuthorized:
          return {
            title: sharedTitle,
            description: `You are not authorized to perform this action. This could mean that somebody has already bought your NFT.`,
            animation: sharedAnimation,
          }
        case ErrorCode.BidStepConstraintViolated:
          return {
            title: sharedTitle,
            description:
              'Somebody placed a higher bid on this auction already. Provide a higher amount if you want to participate.',
            animation: sharedAnimation,
          }
        case ErrorCode.BidDoesNotExist:
          return {
            title: sharedTitle,
            description: 'This bid does not exist anymore. This could mean that it has been withdrawn by the bidder.',
            animation: sharedAnimation,
          }
        case ErrorCode.InvalidBuyNowPriceProvided:
          return {
            title: sharedTitle,
            description: `You can't buy this NFT for this amount. This could mean that the buy now price has been changed.`,
            animation: sharedAnimation,
          }
        case ErrorCode.IsNotEnglishAuctionType:
          return {
            title: sharedTitle,
            description:
              'You cannot perform this action. This could mean that somebody bought this NFT for fixed price or settled it already.',
            animation: sharedAnimation,
          }
        case ErrorCode.IsNotOpenAuctionType:
          return {
            title: sharedTitle,
            description:
              'You cannot perform this action. This could mean that somebody bought this NFT for fixed price or auction winner has been picked already.',
            animation: sharedAnimation,
          }
        case ErrorCode.NftNotInBuyNowState:
          return {
            title: sharedTitle,
            description:
              'You cannot perform this action. This could mean that this NFT has been bought already or the sale was canceled.',
            animation: sharedAnimation,
          }
        case ErrorCode.LiquidityRestrictions:
          return {
            title: sharedTitle,
            description:
              "You don't have enough tokens in your member account to pay transaction fee. Add tokens to your membership balance and try again.",
            animation: sharedAnimation,
          }
        case ErrorCode.WithdrawFromChannelAmountExceedsBalanceMinusExistentialDeposit:
          return {
            title: sharedTitle,
            description:
              "You're trying to withdraw too many tokens from your channel account. Please decrease the amount and try again.",
            animation: sharedAnimation,
          }
        case ErrorCode.DataObjectStateBloatBondChanged:
          return {
            title: sharedTitle,
            description: 'Bloat bond for data object state has changed. Please reload the app and try again.',
            animation: sharedAnimation,
          }
        case ErrorCode.VideoStateBloatBondChanged:
          return {
            title: sharedTitle,
            description: 'Bloat bond for video state has changed. Please reload the app and try again.',
            animation: sharedAnimation,
          }
        case ErrorCode.ChannelStateBloatBondChanged:
          return {
            title: sharedTitle,
            description: 'Bloat bond for channel state has changed. Please reload the app and try again.',
            animation: sharedAnimation,
          }
        case ErrorCode.InsufficientBalance:
          return {
            title: sharedTitle,
            description:
              'Insufficient balance to perform this action. Add tokens to your membership balance and try again.',
            animation: sharedAnimation,
          }
        case ErrorCode.InsufficientBalanceForChannelCreation:
          return {
            title: sharedTitle,
            description:
              'Insufficient balance to create a channel. Add tokens to your membership balance and try again.',
            animation: sharedAnimation,
          }
        case ErrorCode.InsufficientBalanceForVideoCreation:
          return {
            title: sharedTitle,
            description: 'Insufficient balance to create a video. Add tokens to your membership balance and try again.',
            animation: sharedAnimation,
          }
        default:
          return {
            title: sharedTitle,
            description:
              'An unexpected error was encountered. The transaction may have succeeded though, refreshing the page is the safest option. If this persists, our Discord community may be a good place to find some help.',
            animation: sharedAnimation,
          }
      }
    }
    default:
      return null
  }
}
