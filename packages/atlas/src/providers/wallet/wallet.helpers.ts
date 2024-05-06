import { BaseDotsamaWallet, Wallet, getWallets } from '@talismn/connect-wallets'

import { atlasConfig } from '@/config'

export const getWalletsList = () => {
  const supportedWallets = getWallets()
  const supportedWalletsNames = supportedWallets.map((wallet) => wallet.extensionName)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unknownWallets = Object.keys((window as any).injectedWeb3 || {}).reduce((acc, walletName) => {
    if (supportedWalletsNames.includes(walletName)) {
      // wallet is already in supportedWallets list
      return acc
    }

    return [...acc, new UnknownWallet(walletName)]
  }, [] as UnknownWallet[])

  const wcWallet = {
    extensionName: 'WalletConnect',
    title: 'WalletConnect',
    logo: {
      src: 'https://dev.gleev.xyz/favicon.ico',
      alt: 'WalletConnect',
    },
    installed: true,
  } as Wallet

  return [
    ...supportedWallets,
    ...unknownWallets,
    ...(atlasConfig.features.walletConnect.walletConnectProjectId ? [wcWallet] : []),
  ]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const filterUnsupportedAccounts = (account: any) => account.type === 'sr25519'

export class UnknownWallet extends BaseDotsamaWallet {
  extensionName: string
  title: string

  constructor(walletName: string) {
    super()
    this.extensionName = walletName
    this.title = walletName
  }
}
