import { ApolloQueryResult } from '@apollo/client'

import { GetCurrentAccountQuery } from '@/api/queries/__generated__/accounts.generated'

export type AuthContextValue = {
  handleLogin: (params: LoginParams, retryCount?: number) => Promise<string>
  isWalletUser: boolean
  isAuthenticating: boolean
  loggedAddress: string | null
  currentUser?: GetCurrentAccountQuery['accountData'] | null
  refetchCurrentUser: () => Promise<ApolloQueryResult<GetCurrentAccountQuery>>
  handleLogout: () => Promise<void>
  isLoggedIn?: boolean
  encodedSeed: string | null
}

// Login handler types
export enum LogInErrors {
  ArtifactsAlreadySaved = 'ArtifactsAlreadySaved',
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

export type AuthModals = 'logIn' | 'externalLogIn' | 'signUp' | 'createChannel' | 'forgotPassword'

type EncryptionArtifacts = {
  id: string
  encryptedSeed: string
  cipherIv: string
}

export type RegisterPayload = {
  joystreamAccountId: string
  gatewayName: string
  timestamp: number
  action: 'createAccount'
  memberId: string
  email: string
  encryptionArtifacts?: EncryptionArtifacts
}

type ExtensionParams = {
  type: 'external'
  signature: (payload: string) => Promise<string | undefined>
  email: string
  address: string
  memberId: string
}

type EmailPasswordParams = {
  type: 'internal'
  email: string
  password: string
  mnemonic: string
  memberId: string
}

export type RegisterParams = ExtensionParams | EmailPasswordParams

type OrionAccountErrorArgs = {
  message?: string
  details?: unknown
  status?: number
}

export class OrionAccountError extends Error {
  details: unknown
  status?: number
  constructor({ message, details, status }: OrionAccountErrorArgs) {
    super(message)
    this.details = details
    this.status = status
  }
}
