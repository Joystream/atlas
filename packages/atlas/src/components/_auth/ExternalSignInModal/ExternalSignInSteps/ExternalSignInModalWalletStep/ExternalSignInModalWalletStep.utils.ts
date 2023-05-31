import { Wallet } from '@talismn/connect-wallets'

import polkaWalletLogo from '@/assets/images/polkawallet-logo.webp'
import { UnknownWallet } from '@/providers/user/user.helpers'

export const PRIORITY_WALLETS = ['talisman', 'subwallet-js']
export const DEFAULT_PRIORITY = 100000
export const MOBILE_SUPPORTED_WALLETS = {
  polkawallet: {
    installUrl: 'https://polkawallet.io/',
    logo: {
      src: polkaWalletLogo,
      alt: 'Polkawallet logo',
    },
  },
}

export const walletSort = <T extends Wallet | UnknownWallet>(w1: T, w2: T) => {
  // known wallets on top (wallets with logo)
  if (w1.logo.src && !w2.logo.src) return -1
  if (!w1.logo.src && w2.logo.src) return 1

  // installed wallets on top
  if (w1.installed && !w2.installed) return -1
  if (!w1.installed && w2.installed) return 1

  // priority wallets on top
  const w1PriorityIndex = PRIORITY_WALLETS.indexOf(w1.extensionName)
  const w2PriorityIndex = PRIORITY_WALLETS.indexOf(w2.extensionName)
  const w1Priority = w1PriorityIndex === -1 ? DEFAULT_PRIORITY : w1PriorityIndex
  const w2Priority = w2PriorityIndex === -1 ? DEFAULT_PRIORITY : w2PriorityIndex
  if (w1Priority < w2Priority) return -1
  if (w1Priority > w2Priority) return 1

  // rest sorted alphabetically
  return w1.title.localeCompare(w2.title)
}
