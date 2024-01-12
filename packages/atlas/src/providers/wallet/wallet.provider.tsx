import { WalletAccount } from '@talismn/connect-wallets'
import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { atlasConfig } from '@/config'
import { JoystreamContext, JoystreamContextValue } from '@/providers/joystream/joystream.provider'
import { useWalletStore } from '@/providers/wallet/wallet.store'
import { SignerWalletAccount, WalletContextValue } from '@/providers/wallet/wallet.types'
import { formatJoystreamAddress } from '@/utils/address'
import { SentryLogger } from '@/utils/logs'
import { retryWalletPromise } from '@/utils/misc'

import { filterUnsupportedAccounts, getWalletsList } from './wallet.helpers'

const WalletContext = createContext<undefined | WalletContextValue>(undefined)
WalletContext.displayName = 'WalletContext'

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { walletStatus, wallet, lastChainMetadataVersion } = useWalletStore()
  const {
    setLastChainMetadataVersion,
    setWallet,
    setWalletAccounts: _setWalletAccounts,
    setWalletStatus,
  } = useWalletStore((state) => state.actions)
  const joystreamCtx = useContext<JoystreamContextValue | undefined>(JoystreamContext)

  const [isSignerMetadataOutdated, setIsSignerMetadataOutdated] = useState(false)

  const setWalletAccounts = useCallback(
    async (accounts: WalletAccount[]) => {
      const polkadotAccounts = accounts.filter(filterUnsupportedAccounts)

      const mappedAccounts = polkadotAccounts.map((account) => {
        return {
          ...account,
          address: formatJoystreamAddress(account.address),
        }
      })
      _setWalletAccounts(mappedAccounts)
    },
    [_setWalletAccounts]
  )

  const initSignerWallet = useCallback(
    async (walletName: string): Promise<SignerWalletAccount[] | null> => {
      try {
        setWalletStatus('pending')
        const allWallets = getWalletsList()
        const selectedWallet = allWallets.find((wallet) => wallet.extensionName === walletName)
        if (!selectedWallet || !selectedWallet.installed) {
          setWalletStatus('disconnected')
          return null
        }

        await selectedWallet.enable(atlasConfig.general.appName)

        // taken from https://github.com/TalismanSociety/talisman-connect/blob/47cfefee9f1333326c0605c159d6ee8ebfba3e84/libs/wallets/src/lib/base-dotsama-wallet/index.ts#L98-L107
        // should be part of future talisman-connect release
        const accounts = await selectedWallet.extension.accounts.get()

        const accountsWithWallet = accounts
          .filter(filterUnsupportedAccounts)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((account: any) => {
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
    [setWallet, setWalletAccounts, setWalletStatus]
  )

  const signInToWallet = useCallback(
    async (walletName?: string, invokedAutomatically?: boolean): Promise<SignerWalletAccount[] | null> => {
      if (!walletName) {
        return null
      }

      try {
        const initializedAccounts = await (!invokedAutomatically
          ? initSignerWallet(walletName)
          : retryWalletPromise(() => initSignerWallet(walletName), 1000, 5000))
        if (initializedAccounts === null) {
          SentryLogger.error('Selected wallet not found or not installed', 'UserProvider')
        }
        return initializedAccounts
      } catch (e) {
        SentryLogger.error('Failed to enable selected wallet', 'UserProvider', e)
        return null
      }
    },
    [initSignerWallet]
  )

  const checkSignerStatus = useCallback(async () => {
    const chainMetadata = await joystreamCtx?.joystream?.getChainMetadata()

    if (wallet?.extension.metadata && chainMetadata) {
      const [localGenesisHash, localSpecVersion] = lastChainMetadataVersion ?? ['', 0]

      // update was skipped
      if (localGenesisHash === chainMetadata.genesisHash && localSpecVersion === chainMetadata.specVersion) {
        return setIsSignerMetadataOutdated(false)
      }

      const extensionMetadata = await wallet.extension.metadata.get()
      const currentChain = extensionMetadata.find(
        (infoEntry: { specVersion: number; genesisHash: string }) =>
          infoEntry.genesisHash === chainMetadata?.genesisHash
      )

      // if there isn't even a metadata entry for node with specific genesis hash then update
      if (!currentChain) {
        return setIsSignerMetadataOutdated(true)
      }

      // if there is metadata for this node then verify specVersion
      const isOutdated = currentChain.specVersion < chainMetadata.specVersion
      setIsSignerMetadataOutdated(isOutdated)
    }
  }, [joystreamCtx?.joystream, lastChainMetadataVersion, wallet?.extension.metadata])

  const updateSignerMetadata = useCallback(async () => {
    const chainMetadata = await joystreamCtx?.joystream?.getChainMetadata()
    return wallet?.extension.metadata.provide(chainMetadata)
  }, [joystreamCtx?.joystream, wallet?.extension.metadata])

  const skipSignerMetadataUpdate = useCallback(async () => {
    const chainMetadata = await joystreamCtx?.joystream?.getChainMetadata()
    if (chainMetadata) {
      setLastChainMetadataVersion(chainMetadata.genesisHash, chainMetadata.specVersion)
      setIsSignerMetadataOutdated(false)
    }
  }, [joystreamCtx?.joystream, setLastChainMetadataVersion])

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

  useEffect(() => {
    checkSignerStatus()
  }, [checkSignerStatus])

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

  const contextValue: WalletContextValue = useMemo(
    () => ({
      signInToWallet,
      isSignerMetadataOutdated,
      updateSignerMetadata,
      skipSignerMetadataUpdate,
    }),
    [signInToWallet, isSignerMetadataOutdated, updateSignerMetadata, skipSignerMetadataUpdate]
  )

  // if (error) {
  //   return <ViewErrorFallback />
  // }

  return <WalletContext.Provider value={contextValue}>{children}</WalletContext.Provider>
}

export const useWalletContext = () => {
  const ctx = useContext(WalletContext)
  if (ctx === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider')
  }
  return ctx
}
