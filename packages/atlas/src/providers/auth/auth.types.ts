import { ApolloQueryResult } from '@apollo/client'

import { GetCurrentAccountQuery } from '@/api/queries/__generated__/accounts.generated'

export type AuthContextValue = {
  handleLogin: (params: LoginParams) => Promise<string>
  isAuthenticating: boolean
  loggedAddress: string | null
  currentUser?: GetCurrentAccountQuery['accountData'] | null
  refetchCurrentUser: () => Promise<ApolloQueryResult<GetCurrentAccountQuery>>
  handleLogout: () => Promise<void>
  isLoggedIn: boolean
}

export type UserSigner = 'external' | 'internal'

// Login handler types
export enum LogInErrors {
  ArtifactsNotFound = 'ArtifactsNotFound',
  NoAccountFound = 'NoAccountFound',
  InvalidPayload = 'InvalidPayload',
  UnknownError = 'UnknownError',
  SignatureCancelled = 'SignatureCancelled',
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

export type AuthModals = 'logIn' | 'externalLogIn' | 'signUp'
