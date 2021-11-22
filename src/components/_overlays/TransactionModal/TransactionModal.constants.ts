import errorAnimation from '@/assets/animations/error.json'
import processingAssetsAnimation from '@/assets/animations/transaction/processing-assets.json'
import processingTransactionAnimation from '@/assets/animations/transaction/processing-transaction.json'
import propagatingChangesAnimation from '@/assets/animations/transaction/propagating-changes.json'
import signatureAnimation from '@/assets/animations/transaction/signature.json'
import { ExtrinsicStatus } from '@/joystream-lib'

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
    description:
      'An unexpected error was encountered. If this persists, our Discord community may be a good place to find some help.',
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
