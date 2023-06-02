import { ApolloQueryResult } from '@apollo/client'
import { KeyringPair } from '@polkadot/keyring/types'

import { GetCurrentAccountQuery } from '@/api/queries/__generated__/accounts.generated'

export type AuthContextValue = {
  handleLogin: (params: LoginParams) => Promise<LogInHandler>
  initializationState: 'loggedIn' | 'logging' | 'needAuthentication' | null
  keypair: KeyringPair | null
  loggedAddress: string | null
  currentUser?: GetCurrentAccountQuery['accountData'] | null
  refetchCurrentUser: () => Promise<ApolloQueryResult<GetCurrentAccountQuery>>
  handleLogout: () => Promise<void>
}

export type UserSigner = 'external' | 'internal'

// Login handler types
export enum LogInErrors {
  ArtifactsNotFound = 'ArtifactsNotFound',
  NoAccountFound = 'NoAccountFound',
  InvalidPayload = 'InvalidPayload',
  LoginError = 'LoginError',
}

export type LogInHandler = {
  data: {
    accountId: string
  } | null
  error?: LogInErrors
}

export type InternalLogin = {
  type: 'internal'
  email: string
  password: string
}

export type ExternalLogin = {
  type: 'external'
  sign: (payload: string) => Promise<string | undefined>
  address: string
}

export type LoginParams = InternalLogin | ExternalLogin
