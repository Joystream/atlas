import errorAnimation from '@/assets/animations/error.json'
import processingAssetsAnimation from '@/assets/animations/transaction/processing-assets.json'
import processingTransactionAnimation from '@/assets/animations/transaction/processing-transaction.json'
import propagatingChangesAnimation from '@/assets/animations/transaction/propagating-changes.json'
import signatureAnimation from '@/assets/animations/transaction/signature.json'
import { ExtrinsicStatus, JoystreamFailedErrorCodeEnum } from '@/joystream-lib'

export const TRANSACTION_STEPS_DETAILS = {
  [ExtrinsicStatus.ProcessingAssets]: {
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
  },
  [ExtrinsicStatus.Unsigned]: {
    title: 'Waiting for your signature',
    description: 'Please sign the transaction using the Polkadot browser extension.',
    animation: {
      data: signatureAnimation,
      size: {
        width: 288,
        height: 216,
      },
      loop: false,
    },
  },
  [ExtrinsicStatus.Signed]: {
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
  },
  [ExtrinsicStatus.Syncing]: {
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
  },
  [ExtrinsicStatus.Error]: {
    title: 'Something went wrong...',
    description: {
      default:
        'An unexpected error was encountered. The transaction may have succeeded though, refreshing the page is the safest option. If this persists, our Discord community may be a good place to find some help.',
      [JoystreamFailedErrorCodeEnum.NftAuctionIsAlreadyExpired]:
        'You cannot bid on this auction. The auction has expired.',
      [JoystreamFailedErrorCodeEnum.ActionHasBidsAlready]:
        'You cannot cancel this auction. The auction has bids already.',
      [JoystreamFailedErrorCodeEnum.ActorNotAuthorized]: `You are not authorized to perform this action.`,
      [JoystreamFailedErrorCodeEnum.BidStepConstraintViolated]:
        'Somebody placed a higher bid on this auction already. Choose a higher amount.',
      [JoystreamFailedErrorCodeEnum.BidDoesNotExist]:
        'This bid does not exists anymore. This could means that it may have been withdrawn by the bidder.',
      [JoystreamFailedErrorCodeEnum.InvalidBuyNowPriceProvided]: `You can't buy the NFT with this price. Buy now price has changed after you wanted to buy it`,
      [JoystreamFailedErrorCodeEnum.IsNotEnglishAuctionType]:
        'You cannot perform this action. This could means that somebody bought this NFT for fixed price or settled it already',
      [JoystreamFailedErrorCodeEnum.IsNotOpenAuctionType]:
        'You cannot perform this action. This could means that open auction winner has been picked before your bid has been processed',
      [JoystreamFailedErrorCodeEnum.NftNotInBuyNowState]:
        'Given video nft is not in buy now state. This could means that somebody bought it already.',
    },
    animation: {
      data: errorAnimation,
      size: {
        width: 288,
        height: 264,
      },
      loop: false,
    },
  },
  [ExtrinsicStatus.VoucherSizeLimitExceeded]: {
    title: 'Storage limit exceeded',
    description:
      "Your transaction failed because publishing associated assets would exceed your storage quota. Each channel has a dedicated storage limit that's controlled by the DAO storage working group. You can ask for additional storage space in #storage-provider channel on Joystream Discord and then try again.",
    animation: {
      data: errorAnimation,
      size: {
        width: 288,
        height: 264,
      },
      loop: false,
    },
  },
}
