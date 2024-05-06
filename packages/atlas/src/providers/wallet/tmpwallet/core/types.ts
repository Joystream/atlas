import type { Signer } from '@polkadot/types/types'

export type KeypairType = 'ed25519' | 'sr25519'

export interface Account {
  address: string
  type?: KeypairType
  genesisHash?: string | null
  name?: string
}

export enum WalletType {
  INJECTED = 'INJECTED',
  WALLET_CONNECT = 'WALLET_CONNECT',
  LEDGER = 'LEDGER',
}

export interface BaseWalletProvider {
  getWallets: () => Promise<BaseWallet[]>
}

export interface WalletMetadata {
  id: string
  title: string
  description?: string
  urls?: { main?: string; browsers?: Record<string, string> }
  iconUrl?: string
  version?: string
}

export type UnsubscribeFn = () => void

export interface BaseWallet {
  metadata: WalletMetadata
  type: WalletType
  // signer will be available when the wallet is connected, otherwise it is undefined
  signer: Signer | undefined
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  isConnected: () => boolean
  getAccounts: () => Promise<Account[]>
  subscribeAccounts: (cb: (accounts: Account[]) => void) => Promise<UnsubscribeFn>
}
