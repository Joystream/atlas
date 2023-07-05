import { cryptoWaitReady } from '@polkadot/util-crypto'
import axios, { isAxiosError } from 'axios'
import BN from 'bn.js'
import { useCallback, useState } from 'react'
import { useMutation } from 'react-query'

import { FAUCET_URL } from '@/config/env'
import { MemberId } from '@/joystream-lib/types'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransactionManagerStore } from '@/providers/transactions/transactions.store'
import { useUser } from '@/providers/user/user.hooks'
import { UploadAvatarServiceError, uploadAvatarImage } from '@/utils/image'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

import { MemberFormData, SignUpFormData, SignUpSteps } from './SignUpModal.types'
import { OrionAccountError, keyring, registerAccount } from './SignUpModal.utils'

type NewMemberResponse = {
  memberId: MemberId
  block: number
}

type FaucetErrorType = 'TooManyRequestsPerIp' | 'TooManyRequests' | 'OnlyNewAccountsCanBeUsedForScreenedMembers'

type NewMemberErrorResponse = {
  error?: FaucetErrorType
}

type FaucetParams = {
  account: string
  handle: string
  avatar: string | undefined
  captchaToken: string | undefined
}

type CreateMemberArgs = {
  data: SignUpFormData
  onStart: () => void
  onSuccess: (amountOfTokens?: number) => void
  onError: (step: SignUpSteps) => void
}
export const useCreateMember = () => {
  const { refetchUserMemberships, setActiveUser } = useUser()
  const [emailAlreadyRegisteredMemberId, setEmailAlreadyRegisteredMemberId] = useState('')
  const setAnonymousUserId = useAuthStore((store) => store.actions.setAnonymousUserId)
  const { joystream } = useJoystream()
  const addBlockAction = useTransactionManagerStore((state) => state.actions.addBlockAction)
  const { displaySnackbar } = useSnackbar()

  const { mutateAsync: avatarMutation } = useMutation('avatar-post', (croppedBlob: Blob) =>
    uploadAvatarImage(croppedBlob)
  )
  const { mutateAsync: faucetMutation } = useMutation('faucet-post', (body: FaucetParams) =>
    axios.post<NewMemberResponse>(FAUCET_URL, body)
  )

  const createNewMember = useCallback(
    async (address: string, data: MemberFormData) => {
      let fileUrl

      if (data.avatar?.blob) {
        fileUrl = await avatarMutation(data.avatar.blob)
      }

      const body: FaucetParams = {
        account: address,
        handle: data.handle,
        avatar: fileUrl,
        captchaToken: data.captchaToken,
      }
      const response = await faucetMutation(body)
      return response.data
    },
    [avatarMutation, faucetMutation]
  )

  const handleSubmit = useCallback(
    async ({ data, onError, onStart, onSuccess }: CreateMemberArgs) => {
      onStart()

      await cryptoWaitReady()
      const keypair = keyring.addFromMnemonic(data.mnemonic)

      const address = keypair.address

      try {
        const callback = async () => {
          try {
            const { data: memberShipData } = await refetchUserMemberships()
            const lastCreatedMembership = memberShipData.memberships[memberShipData.memberships.length - 1]

            if (lastCreatedMembership) {
              await registerAccount(data.email, data.password, data.mnemonic, memberId.toString())
              setAnonymousUserId('')
              setActiveUser({ accountId: address, memberId: lastCreatedMembership.id, channelId: null })
            }

            if (!joystream) {
              ConsoleLogger.error('No joystream instance')
              return
            }
            const { lockedBalance } = await joystream.getAccountBalance(address)
            const amountOfTokens = hapiBnToTokenNumber(new BN(lockedBalance))
            onSuccess(amountOfTokens)
          } catch (error) {
            if (error instanceof OrionAccountError) {
              const errorCode = error.status
              const errorMessage = error.message
              if (errorMessage === 'Account with the provided e-mail address already exists.') {
                displaySnackbar({
                  title: 'Something went wrong',
                  description: `Account with the provided e-mail address already exists. Use different e-mail.`,
                  iconType: 'error',
                })
                setEmailAlreadyRegisteredMemberId(memberId)
                onError(SignUpSteps.SignUpEmail)
              } else {
                displaySnackbar({
                  title: 'Something went wrong',
                  description: `There was a problem with creating your account. Please try again later.${
                    errorCode ? ` Error code: ${errorCode}` : ''
                  }`,
                  iconType: 'error',
                })
                onError(SignUpSteps.CreateMember)
              }

              SentryLogger.error('Failed to create an account', 'SignUpModal', error)
            }
          }
        }

        // skip member creation in case of email already exists error
        if (emailAlreadyRegisteredMemberId) {
          await registerAccount(data.email, data.password, data.mnemonic, emailAlreadyRegisteredMemberId.toString())
          setAnonymousUserId('')
          setActiveUser({ accountId: address, memberId: emailAlreadyRegisteredMemberId, channelId: null })
          onSuccess()
          return
        }
        const { block, memberId } = await createNewMember(address, data)

        addBlockAction({ targetBlock: block, callback })
      } catch (error) {
        if (error instanceof UploadAvatarServiceError) {
          displaySnackbar({
            title: 'Something went wrong',
            description: 'Avatar could not be uploaded. Try again later',
            iconType: 'error',
          })
          onError(SignUpSteps.CreateMember)
          SentryLogger.error('Failed to upload member avatar', 'SignUpModal', error)
          return
        }

        const errorCode = isAxiosError<NewMemberErrorResponse>(error) ? error.response?.data?.error : null

        SentryLogger.error('Failed to create a membership', 'SignUpModal', error, { error: { errorCode } })

        switch (errorCode) {
          case 'TooManyRequestsPerIp':
            displaySnackbar({
              title: 'You reached a membership limit',
              description:
                'Your membership could not be created as you already created one recently from the same IP address. Try again in 2 days.',
              iconType: 'error',
            })
            break
          case 'TooManyRequests':
            displaySnackbar({
              title: 'Our system is overloaded',
              description:
                'Your membership could not be created as our system is undergoing a heavy traffic. Please, try again in a little while.',
              iconType: 'error',
            })
            break
          case 'OnlyNewAccountsCanBeUsedForScreenedMembers':
            displaySnackbar({
              title: 'This account is not new',
              description:
                'Your membership could not be created as the selected wallet account has either made some transactions in the past or has some funds already on it. Please, try again using a fresh wallet account. ',
              iconType: 'error',
            })
            break

          default:
            displaySnackbar({
              title: 'Something went wrong',
              description: `There was a problem with creating your membership. Please try again later.${
                errorCode ? ` Error code: ${errorCode}` : ''
              }`,
              iconType: 'error',
            })
            break
        }

        onError(SignUpSteps.CreateMember)
        return
      }
    },
    [
      addBlockAction,
      createNewMember,
      displaySnackbar,
      emailAlreadyRegisteredMemberId,
      joystream,
      refetchUserMemberships,
      setActiveUser,
      setAnonymousUserId,
    ]
  )
  return handleSubmit
}
