import { cryptoWaitReady } from '@polkadot/util-crypto'
import { isAxiosError } from 'axios'
import BN from 'bn.js'
import { useCallback } from 'react'
import { useMutation } from 'react-query'

import { axiosInstance } from '@/api/axios'
import { ImageInputFile } from '@/components/_inputs/MultiFileSelect'
import { FAUCET_URL, YPP_FAUCET_URL } from '@/config/env'
import { keyring } from '@/joystream-lib/lib'
import { MemberId } from '@/joystream-lib/types'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { registerAccount } from '@/providers/auth/auth.helpers'
import { useAuth } from '@/providers/auth/auth.hooks'
import { useAuthStore } from '@/providers/auth/auth.store'
import { OrionAccountError } from '@/providers/auth/auth.types'
import { useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransactionManagerStore } from '@/providers/transactions/transactions.store'
import { useYppStore } from '@/providers/ypp/ypp.store'
import { UploadAvatarServiceError, uploadAvatarImage } from '@/utils/image'
import { ConsoleLogger, SentryLogger, UserEventsLogger } from '@/utils/logs'

export type MemberFormData = {
  handle: string
  avatar?: ImageInputFile
  captchaToken?: string
  mnemonic: string
  authorizationCode?: string
  userId?: string
  confirmedCopy: boolean
  referrerChannelId?: string
}

export type AccountFormData = {
  email: string
  password: string
  mnemonic: string
  confirmedTerms: boolean
  memberId: string
  referrerChannelId?: string
}

type NewMemberResponse = {
  memberId: MemberId
  block: number
}

export enum FaucetError {
  TooManyRequestsPerIp,
  TooManyRequests,
  OnlyNewAccountsCanBeUsedForScreenedMembers,
  UploadAvatarServiceError,
  UnknownError,
  MemberAlreadyCreatedForGoogleAccount,
}

type NewMemberErrorResponse = {
  error?: keyof typeof FaucetError | 'Bad Request'
}

type FaucetParams = {
  account: string
  handle: string
  avatar: string | undefined
  captchaToken: string | undefined
  userId?: string
  authorizationCode?: string
}

export enum RegisterError {
  EmailAlreadyExists = 'EmailAlreadyExists',
  UnknownError = 'UnknownError',
  MembershipNotFound = 'MembershipNotFound',
  SessionRequired = 'SessionRequired',
}

type SignUpParams<T, E> = {
  data: T
  onStart?: () => void
  onSuccess?: (params: { amountOfTokens: number }) => void
  onError?: (step?: E) => void
}

// replace avatar's ImageInputFile type with simpler CreateMemberAvatarParam, because we only need blob file to upload new avatar
type CreateMemberAvatarParam = { avatar?: { blob?: null | Blob } }
type CreateNewMemberParams<E> = SignUpParams<
  Omit<MemberFormData, 'confirmedCopy' | 'avatar'> & CreateMemberAvatarParam,
  E
>

export const useCreateMember = () => {
  const { handleLogin } = useAuth()
  const setAnonymousUserId = useAuthStore((store) => store.actions.setAnonymousUserId)
  const { joystream } = useJoystream()
  const { displaySnackbar } = useSnackbar()
  const { addBlockAction } = useTransactionManagerStore((state) => state.actions)
  const ytResponseData = useYppStore((state) => state.ytResponseData)

  const { mutateAsync: avatarMutation } = useMutation('avatar-post', (croppedBlob: Blob) =>
    uploadAvatarImage(croppedBlob)
  )
  const { mutateAsync: faucetMutation } = useMutation('faucet-post', (body: FaucetParams) =>
    axiosInstance.post<NewMemberResponse>(ytResponseData ? YPP_FAUCET_URL : FAUCET_URL, body)
  )

  const createNewMember = useCallback(
    async (params: CreateNewMemberParams<FaucetError>, onBlockSync?: () => void) => {
      const { data, onError, onStart } = params
      let fileUrl
      const keypair = keyring.addFromMnemonic(data.mnemonic)
      const address = keypair.address

      if (data.avatar?.blob) {
        fileUrl = await avatarMutation(data.avatar.blob)
      }

      const body: FaucetParams = {
        account: address,
        handle: data.handle,
        avatar: fileUrl,
        captchaToken: data.captchaToken,
        ...(ytResponseData
          ? {
              userId: data.userId,
              authorizationCode: data.authorizationCode,
              ...(data.referrerChannelId ? { referrerChannelId: data.referrerChannelId } : {}),
            }
          : {}),
      }
      try {
        onStart?.()
        const response = await faucetMutation(body)
        onBlockSync && addBlockAction({ callback: onBlockSync, targetBlock: response.data.block })

        return String(response.data.memberId)
      } catch (error) {
        if (error instanceof UploadAvatarServiceError) {
          displaySnackbar({
            title: 'Something went wrong',
            description: 'Avatar could not be uploaded. Try again later',
            iconType: 'error',
          })
          onError?.(FaucetError.UploadAvatarServiceError)
          UserEventsLogger.logUserError('failed-avatar-upload', { message: error.message })
          SentryLogger.error('Failed to upload member avatar', 'SignUpModal', error)
          return
        }

        const errorCode = isAxiosError<NewMemberErrorResponse>(error) ? error.response?.data?.error : null

        SentryLogger.error(`Failed to create a membership ${ytResponseData ? 'YPP' : ''}`, 'SignUpModal', error, {
          parsed: { errorCode },
        })

        switch (errorCode) {
          case 'TooManyRequestsPerIp':
            displaySnackbar({
              title: 'You reached a membership limit',
              description:
                'Your membership could not be created as you already created one recently from the same IP address. Try again in 2 days.',
              iconType: 'error',
            })
            onError?.(FaucetError.TooManyRequestsPerIp)
            return

          case 'TooManyRequests':
            displaySnackbar({
              title: 'Our system is overloaded',
              description:
                'Your membership could not be created as our system is undergoing a heavy traffic. Please, try again in a little while.',
              iconType: 'error',
            })
            onError?.(FaucetError.TooManyRequests)
            return
          case 'OnlyNewAccountsCanBeUsedForScreenedMembers':
            displaySnackbar({
              title: 'This account is not new',
              description:
                'Your membership could not be created as the selected wallet account has either made some transactions in the past or has some funds already on it. Please, try again using a fresh wallet account. ',
              iconType: 'error',
            })
            onError?.(FaucetError.OnlyNewAccountsCanBeUsedForScreenedMembers)
            return
          case 'Bad Request': {
            const message = error.response?.data?.message
            if (typeof message === 'string' && message.startsWith('Already created Joysteam member')) {
              displaySnackbar({
                title: 'Something went wrong',
                description:
                  'This YouTube channel is already signed up and connected with Joystream membership. Report this to Support channel for help.',
                iconType: 'error',
              })
              onError?.(FaucetError.MemberAlreadyCreatedForGoogleAccount)
            } else {
              onError?.(FaucetError.UnknownError)
            }
            return
          }

          default:
            displaySnackbar({
              title: 'Something went wrong',
              description: `There was a problem with creating your membership. Please try again later.${
                errorCode ? ` Error code: ${errorCode}` : ''
              }`,
              iconType: 'error',
            })
            onError?.(FaucetError.UnknownError)
            return
        }
      }
    },
    [addBlockAction, avatarMutation, displaySnackbar, faucetMutation, ytResponseData]
  )

  const createNewOrionAccount = useCallback(
    async ({ data, onError, onStart, onSuccess }: SignUpParams<AccountFormData, RegisterError>) => {
      onStart?.()

      await cryptoWaitReady()
      const keypair = keyring.addFromMnemonic(data.mnemonic)

      const address = keypair.address

      try {
        await registerAccount({ type: 'internal', ...data })
        setAnonymousUserId('')

        if (!joystream) {
          ConsoleLogger.error('No joystream instance')
          throw new Error('No joystream instance')
        }
        const { lockedBalance } = await joystream.getAccountBalance(address)
        const amountOfTokens = hapiBnToTokenNumber(new BN(lockedBalance))
        onSuccess?.({ amountOfTokens })
        handleLogin({ type: 'internal', ...data })
      } catch (error) {
        if (error instanceof OrionAccountError) {
          const errorCode = error.status
          const errorMessage = error.message
          if (errorMessage === 'Account with the provided e-mail address already exists.') {
            displaySnackbar({
              iconType: 'error',
              title: 'This email was used already',
              description:
                'To create new membership you need to use an email that is not connected to already existing account.',
            })
            onError?.(RegisterError.EmailAlreadyExists)
            return
          } else if (errorMessage.startsWith('Membership not found by id')) {
            onError?.(RegisterError.MembershipNotFound)
            return
          } else if (errorMessage.startsWith("cookie 'session_id' required")) {
            onError?.(RegisterError.SessionRequired)
            return
          } else {
            displaySnackbar({
              title: 'Something went wrong',
              description: `There was a problem with creating your account. Please try again later.${
                errorCode ? ` Error code: ${errorCode}` : ''
              }`,
              iconType: 'error',
            })
            onError?.(RegisterError.UnknownError)
          }

          SentryLogger.error('Failed to create an account', 'SignUpModal', error)
        }
      }
    },
    [displaySnackbar, handleLogin, joystream, setAnonymousUserId]
  )
  return {
    createNewMember,
    createNewOrionAccount,
  }
}
