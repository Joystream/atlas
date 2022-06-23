import { InjectedWindowProvider } from '@polkadot/extension-inject/types'
import { BaseDotsamaWallet, WalletAccount, getWallets } from '@talisman-connect/wallets'
import { useCallback, useEffect } from 'react'
import shallow from 'zustand/shallow'

import { WEB3_APP_NAME } from '@/config/urls'
import { ConsoleLogger } from '@/utils/logs'

import { useUserStore } from './user.store'
import { SignerWalletAccount } from './user.types'

type InjectedWeb3 = Record<string, InjectedWindowProvider>

export const useSignerWallet = () => {
  const { walletStatus, walletAccounts, wallet, accountId } = useUserStore(
    (state) => ({
      walletStatus: state.walletStatus,
      walletAccounts: state.walletAccounts,
      wallet: state.wallet,
      accountId: state.accountId,
    }),
    shallow
  )
  const { setWalletAccounts, setWalletStatus, resetActiveUser, setWallet } = useUserStore((state) => state.actions)

  const handleAccountsChange = useCallback(
    (accounts?: WalletAccount[]) => {
      if (!accounts) {
        setWalletAccounts([])
        return
      }
      setWalletAccounts(accounts)
    },
    [setWalletAccounts]
  )

  const getWalletsList = useCallback(() => {
    const supportedWallets = getWallets()
    const supportedWalletsNames = supportedWallets.map((wallet) => wallet.extensionName)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unknownWallets = Object.keys(((window as any).injectedWeb3 as InjectedWeb3) || {}).reduce(
      (acc, walletName) => {
        if (supportedWalletsNames.includes(walletName)) {
          // wallet is already in supportedWallets list
          return acc
        }

        return [...acc, new UnknownWallet(walletName)]
      },
      [] as UnknownWallet[]
    )

    return [...supportedWallets, ...unknownWallets]
  }, [])

  const initSignerWallet = useCallback(
    async (walletName: string): Promise<SignerWalletAccount[] | null> => {
      try {
        setWalletStatus('pending')
        const allWallets = getWalletsList()
        const selectedWallet = allWallets.find((wallet) => wallet.extensionName === walletName)
        if (!selectedWallet || !selectedWallet.installed) {
          setWalletStatus('disconnected')
          resetActiveUser()
          return null
        }

        await selectedWallet.enable(WEB3_APP_NAME)

        // taken from https://github.com/TalismanSociety/talisman-connect/blob/47cfefee9f1333326c0605c159d6ee8ebfba3e84/libs/wallets/src/lib/base-dotsama-wallet/index.ts#L98-L107
        // should be part of future talisman-connect release
        const accounts = await selectedWallet.extension.accounts.get()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const accountsWithWallet = accounts.map((account: any) => {
          return {
            ...account,
            source: selectedWallet.extension?.name as string,
            wallet: selectedWallet,
            signer: selectedWallet.extension?.signer,
          }
        })

        setWalletAccounts(accountsWithWallet)
        setWallet(selectedWallet)
        setWalletStatus('connected')

        return accountsWithWallet
      } catch (e) {
        setWalletStatus('disconnected')
        throw e
      }
    },
    [getWalletsList, resetActiveUser, setWallet, setWalletAccounts, setWalletStatus]
  )

  // subscribe to account changes when extension is connected
  useEffect(() => {
    if (!wallet || walletStatus !== 'connected') {
      return
    }

    type UnsubFn = () => void
    let unsubscribeAccounts: UnsubFn | undefined
    const subscribePromise = wallet.subscribeAccounts(handleAccountsChange) as Promise<UnsubFn>
    subscribePromise.then((unsub) => {
      unsubscribeAccounts = unsub
    })
    return () => {
      unsubscribeAccounts?.()
    }
  }, [handleAccountsChange, wallet, walletStatus])

  // reset the active user if the selected account is not found
  useEffect(() => {
    if (!accountId || walletStatus !== 'connected') {
      return
    }

    const account = walletAccounts.find((a) => a.address === accountId)

    if (!account) {
      ConsoleLogger.warn('Selected accountId not found in extension accounts, resetting user')
      resetActiveUser()
    }
  }, [accountId, resetActiveUser, walletStatus, walletAccounts])

  return { getWalletsList, initSignerWallet }
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
