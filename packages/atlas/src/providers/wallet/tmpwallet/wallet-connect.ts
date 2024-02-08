import type { Account, BaseWallet, BaseWalletProvider, UnsubscribeFn, WalletMetadata } from './core'
import { WalletType } from './core'
import type { Signer } from '@polkadot/types/types'
import { WalletConnectModal } from '@walletconnect/modal'
import Client, { SignClient } from '@walletconnect/sign-client'
import type { SessionTypes } from '@walletconnect/types'

import { POLKADOT_CHAIN_ID, WC_VERSION } from './consts'
import { WalletConnectSigner } from './signer.js'
import type { WalletConnectConfiguration, WcAccount } from './types.js'

const toWalletAccount = (wcAccount: WcAccount) => ({ address: wcAccount.split(':')[2] })

interface ModalState {
  open: boolean
}

export class WalletConnectWallet implements BaseWallet {
  type = WalletType.WALLET_CONNECT
  appName: string
  metadata: WalletMetadata
  config: WalletConnectConfiguration
  client: Client | undefined
  signer: Signer | undefined
  session: SessionTypes.Struct | undefined
  walletConnectModal: WalletConnectModal

  constructor(config: WalletConnectConfiguration, appName: string) {
    if (!config.chainIds || config.chainIds.length === 0) config.chainIds = [POLKADOT_CHAIN_ID]
    this.config = config
    this.appName = appName
    this.metadata = {
      id: 'wallet-connect',
      title: config.metadata?.name || 'Wallet Connect',
      description: config.metadata?.description || '',
      urls: { main: config.metadata?.url || '' },
      iconUrl: config.metadata?.icons[0] || '',
      version: WC_VERSION,
    }
    this.walletConnectModal = new WalletConnectModal({
      projectId: config.projectId,
      chains: config.chainIds,
      themeMode: 'dark',
      themeVariables: {
        '--wcm-z-index': '99999999!important',
      },
    })
  }

  reset(): void {
    this.client = undefined
    this.session = undefined
    this.signer = undefined
  }

  async getAccounts(): Promise<Account[]> {
    let accounts: Account[] = []

    if (this.session) {
      const wcAccounts = Object.values(this.session.namespaces)
        .map((namespace) => namespace.accounts)
        .flat()

      accounts = wcAccounts.map((wcAccount) => toWalletAccount(wcAccount as WcAccount))
    }

    return accounts
  }

  async subscribeAccounts(cb: (accounts: Account[]) => void): Promise<UnsubscribeFn> {
    const handler = async () => {
      cb(await this.getAccounts())
    }

    await handler()

    this.client?.on('session_delete', handler)
    this.client?.on('session_expire', handler)
    this.client?.on('session_update', handler)

    return () => {
      this.client?.off('session_update', handler)
      this.client?.off('session_expire', handler)
      this.client?.off('session_update', handler)
    }
  }

  async connect() {
    this.reset()

    this.client = await SignClient.init(this.config)

    this.client.on('session_delete', () => {
      this.reset()

      if (this.config.onSessionDelete) {
        this.config.onSessionDelete()
      }
    })

    const namespaces = {
      requiredNamespaces: {
        polkadot: {
          chains: this.config.chainIds,
          methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
          events: [],
        },
      },
      optionalNamespaces: {
        polkadot: {
          chains: this.config.optionalChainIds,
          methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
          events: [],
        },
      },
    }

    const lastKeyIndex = this.client.session.getAll().length - 1
    const lastSession = this.client.session.getAll()[lastKeyIndex]

    if (lastSession) {
      return new Promise<void>((resolve) => {
        this.session = lastSession
        this.signer = new WalletConnectSigner(this.client!, lastSession, POLKADOT_CHAIN_ID)
        resolve()
      })
    }

    const { uri, approval } = await this.client.connect(namespaces)

    return new Promise<void>((resolve, reject) => {
      if (uri) {
        this.walletConnectModal.openModal({ uri })
      }

      const unsubscribeModal = this.walletConnectModal.subscribeModal((state: ModalState) => {
        if (state.open === false) {
          unsubscribeModal()
          resolve()
        }
      })

      approval()
        .then((session) => {
          this.session = session
          this.signer = new WalletConnectSigner(this.client!, session, POLKADOT_CHAIN_ID)

          resolve()
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => this.walletConnectModal.closeModal())
    })
  }

  async disconnect() {
    if (this.session?.topic) {
      this.client?.disconnect({
        topic: this.session?.topic,
        reason: {
          code: -1,
          message: 'Disconnected by client!',
        },
      })
    }

    this.reset()
  }

  isConnected() {
    return !!(this.client && this.signer && this.session)
  }
}

export class WalletConnectProvider implements BaseWalletProvider {
  config: WalletConnectConfiguration
  appName: string

  constructor(config: WalletConnectConfiguration, appName: string) {
    this.config = config
    this.appName = appName
  }

  getWallets(): Promise<BaseWallet[]> {
    return new Promise((resolve) => resolve([new WalletConnectWallet(this.config, this.appName)]))
  }
}
