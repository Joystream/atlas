import { BaseDotsamaWallet, WalletAccount, getWallets } from '@talismn/connect-wallets'
import { useCallback, useEffect } from 'react'
import shallow from 'zustand/shallow'

import { atlasConfig } from '@/config'
import { formatJoystreamAddress } from '@/utils/address'
import { ConsoleLogger } from '@/utils/logs'

import { useUserStore } from './user.store'
import { SignerWalletAccount } from './user.types'

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
  const {
    setWalletAccounts: _setWalletAccount,
    setWalletStatus,
    resetActiveUser,
    setWallet,
  } = useUserStore((state) => state.actions)

  const setWalletAccounts = useCallback(
    async (accounts: WalletAccount[]) => {
      const mappedAccounts = accounts.map((account) => {
        return {
          ...account,
          address: formatJoystreamAddress(account.address),
        }
      })
      _setWalletAccount([
        ...mappedAccounts,
        { ...mappedAccounts[0], address: 'j4TRREpGPwWP3cdpJt1V9XQeK93tUkRkZWpRXbDgpb2P7X1NY', name: 'test' },
      ])
    },
    [_setWalletAccount]
  )

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
    const unknownWallets = Object.keys((window as any).injectedWeb3 || {}).reduce((acc, walletName) => {
      if (supportedWalletsNames.includes(walletName)) {
        // wallet is already in supportedWallets list
        return acc
      }

      return [...acc, new UnknownWallet(walletName)]
    }, [] as UnknownWallet[])

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

        await selectedWallet.enable(atlasConfig.general.appName)

        // taken from https://github.com/TalismanSociety/talisman-connect/blob/47cfefee9f1333326c0605c159d6ee8ebfba3e84/libs/wallets/src/lib/base-dotsama-wallet/index.ts#L98-L107
        // should be part of future talisman-connect release
        const accounts = await selectedWallet.extension.accounts.get()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const accountsWithWallet = accounts.map((account: any) => {
          return {
            ...account,
            address: formatJoystreamAddress(account.address),
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
