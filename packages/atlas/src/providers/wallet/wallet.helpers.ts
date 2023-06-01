import { BaseDotsamaWallet, getWallets } from '@talismn/connect-wallets'

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

  return [...supportedWallets, ...unknownWallets]
}

export class UnknownWallet extends BaseDotsamaWallet {
  extensionName: string
  title: string

  constructor(walletName: string) {
    super()
    this.extensionName = walletName
    this.title = walletName
  }
}
