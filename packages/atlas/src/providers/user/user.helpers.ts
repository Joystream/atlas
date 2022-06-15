import { WalletAccount, getWallets } from '@talisman-connect/wallets'
import { useCallback, useEffect } from 'react'
import shallow from 'zustand/shallow'

import { WEB3_APP_NAME } from '@/config/urls'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

import { useUserStore } from './user.store'
import { SignerWalletAccount } from './user.types'

const WALLET_ACCESS_TIMEOUT = 10000

export const useSignerWallet = () => {
  const [openModal, closeModal] = useConfirmationModal()
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

  const initSignerWallet = useCallback(async (): Promise<SignerWalletAccount[] | null> => {
    try {
      const extensionName = 'polkadot-js' // TODO: allow the user to pick the extension, for now it's hardcoded

      setWalletStatus('pending')
      const allWallets = getWallets()
      const selectedWallet = allWallets.find((wallet) => wallet.extensionName === extensionName)
      if (!selectedWallet || !selectedWallet.installed) {
        ConsoleLogger.warn('No Polkadot extension detected')
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
      SentryLogger.error('Failed to initialize Polkadot signer extension', 'ActiveUserProvider', e)
      return null
    }
  }, [resetActiveUser, setWallet, setWalletAccounts, setWalletStatus])

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

  const isWalletPending = walletStatus === 'pending'
  // show long loading modal
  useEffect(() => {
    if (!isWalletPending) {
      closeModal()
      return
    }

    const timeout = setTimeout(() => {
      openModal({
        type: 'warning',
        title: 'Failed to connect with extension',
        description:
          "Seems you didn't enable the Polkadot extension and we cannot access your accounts. You can do that by clicking the extension icon in your browser toolbar. If you cannot do that, please reload the page and try again.",
        primaryButton: {
          text: 'Reload page',
          onClick: () => {
            closeModal()
            window.location.reload()
          },
        },
        secondaryButton: {
          text: 'Cancel',
          onClick: () => {
            closeModal()
            setWalletStatus('disconnected')
          },
        },
      })
    }, WALLET_ACCESS_TIMEOUT)

    return () => {
      closeModal()
      clearTimeout(timeout)
    }
  }, [isWalletPending, closeModal, openModal, setWalletStatus])

  return { initSignerWallet }
}
