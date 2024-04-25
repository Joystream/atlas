import {
  errorAnimation,
  processingAssetsAnimation,
  processingTransactionAnimation,
  propagatingChangesAnimation,
  signatureAnimation,
} from '@/assets/animations'
import { atlasConfig } from '@/config'
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
        case ErrorCode.TokenDoesNotExist:
          return {
            title: sharedTitle,
            description:
              "We couldn't find token that was requested in your transaction, refresh the page and try again. If the problem persists please contact support.",
            animation: sharedAnimation,
          }
        case ErrorCode.NoActiveSale:
          return {
            title: sharedTitle,
            description: 'There is no active sale for this token, refresh the page and try again.',
            animation: sharedAnimation,
          }
        case ErrorCode.InsufficientBalanceForTokenPurchase:
          return {
            title: sharedTitle,
            description: `Looks like your balance was insufficient for token purchase. Decrease the amount or buy more ${atlasConfig.joystream.tokenTicker} in Portfolio.`,
            animation: sharedAnimation,
          }
        case ErrorCode.NotEnoughTokensOnSale:
          return {
            title: sharedTitle,
            description: `Amount of tokens to purchase on sale exceeds the quantity of tokens still available on the sale.`,
            animation: sharedAnimation,
          }
        case ErrorCode.SaleStartingBlockInThePast:
          return {
            title: sharedTitle,
            description: 'Specified sale starting block is in the past. Pick future date and try again',
            animation: sharedAnimation,
          }
        case ErrorCode.SaleAccessProofRequired:
          return {
            title: sharedTitle,
            description: 'Only whitelisted participants are allowed to access the sale.',
            animation: sharedAnimation,
          }
        case ErrorCode.PreviousSaleNotFinalized:
          return {
            title: sharedTitle,
            description: 'There can be only one sale active at the same time. Finalize the old one to start new.',
            animation: sharedAnimation,
          }
        case ErrorCode.SaleDurationTooShort:
          return {
            title: sharedTitle,
            description: 'Sale duration is too short. Please pick longer time frame.',
            animation: sharedAnimation,
          }
        case ErrorCode.CannotInitSaleIfAmmIsActive:
          return {
            title: sharedTitle,
            description: 'Cannot initialize a sale when the market is active.',
            animation: sharedAnimation,
          }
        case ErrorCode.RevenueSplitDurationTooShort:
          return {
            title: sharedTitle,
            description: 'Revenue split duration is too short. Pick longer time frame.',
            animation: sharedAnimation,
          }
        case ErrorCode.RevenueSplitAlreadyActiveForToken:
          return {
            title: sharedTitle,
            description: 'There is already active revenue share for the token. Finalize it to start a new one.',
            animation: sharedAnimation,
          }
        case ErrorCode.RevenueSplitNotActiveForToken:
          return {
            title: sharedTitle,
            description: 'Revenue share already ended. Wait for a new one to claim your share.',
            animation: sharedAnimation,
          }
        case ErrorCode.RevenueSplitDidNotEnd:
          return {
            title: sharedTitle,
            description: 'Revenue Split has not ended yet, refresh the page and try again.',
            animation: sharedAnimation,
          }
        case ErrorCode.RevenueSplitNotOngoing:
          return {
            title: sharedTitle,
            description: 'Revenue share for token is not yet ongoing, refresh the page and try again.',
            animation: sharedAnimation,
          }
        case ErrorCode.UserAlreadyParticipating:
          return {
            title: sharedTitle,
            description: 'You are already participating in the revenue share.',
            animation: sharedAnimation,
          }
        case ErrorCode.InsufficientBalanceForSplitParticipation:
          return {
            title: sharedTitle,
            description: "You don't have enough balance to participate in the revenue share.",
            animation: sharedAnimation,
          }
        case ErrorCode.CannotModifySupplyWhenRevenueSplitsAreActive:
          return {
            title: sharedTitle,
            description: 'Transaction was blocked to avoid token supply changes during the revenue share.',
            animation: sharedAnimation,
          }
        case ErrorCode.NotInAmmState:
          return {
            title: sharedTitle,
            description: 'There is no open market for the token.',
            animation: sharedAnimation,
          }
        case ErrorCode.SlippageToleranceExceeded:
          return {
            title: sharedTitle,
            description:
              'Your order failed to succeed due to slippage exceed. This means that other user just executed their own order which resulted in the price change, to prevent you from losing money your order was cancelled.',
            animation: sharedAnimation,
          }
        case ErrorCode.OutstandingAmmProvidedSupplyTooLarge:
          return {
            title: sharedTitle,
            description:
              'Outstanding market supply is too large. Sell more tokens to the market before trying to close it.',
            animation: sharedAnimation,
          }
        case ErrorCode.NotEnoughTokenMintedByAmmForThisSale:
          return {
            title: sharedTitle,
            description:
              'There are not enough tokens on the market to execute your order. Decrease the amount and try again.',
            animation: sharedAnimation,
          }
        case ErrorCode.CurveSlopeParametersTooLow:
          return {
            title: sharedTitle,
            description: 'Curve slope parameters below minimum allowed.',
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
