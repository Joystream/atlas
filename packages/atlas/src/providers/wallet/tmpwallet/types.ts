import { SignClientTypes } from '@walletconnect/types'

export type WcAccount = `${string}:${string}:${string}`

export type PolkadotNamespaceChainId = `polkadot:${string}`

interface ModalState {
  open: boolean
}

export type ConnectionModal = {
  openModal: () => Promise<void>
  subscribeModal: (callback: (state: ModalState) => void) => () => void
  closeModal: () => void
}

export interface WalletConnectConfiguration extends SignClientTypes.Options {
  // ToDo: Remove ```projectId``` when the following issue is resolved:
  // https://github.com/WalletConnect/walletconnect-monorepo/pull/3435
  projectId: string
  chainIds?: PolkadotNamespaceChainId[]
  relayUrl?: string
  optionalChainIds?: PolkadotNamespaceChainId[]
  onSessionDelete?: () => void
}
