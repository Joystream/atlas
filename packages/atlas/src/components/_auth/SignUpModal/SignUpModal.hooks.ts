import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types/.'
import { ScryptOpts, scrypt } from '@noble/hashes/scrypt'
import { Keyring } from '@polkadot/keyring'
import { hexToU8a, u8aToHex } from '@polkadot/util'
import { cryptoWaitReady, mnemonicToEntropy } from '@polkadot/util-crypto'
import axios, { isAxiosError } from 'axios'
import BN from 'bn.js'
import { Buffer } from 'buffer'
import { AES, enc, lib, mode } from 'crypto-js'
import { useCallback, useState } from 'react'
import { useMutation } from 'react-query'

import { atlasConfig } from '@/config'
import { FAUCET_URL, ORION_AUTH_URL } from '@/config/env'
import { MemberId } from '@/joystream-lib/types'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useJoystream } from '@/providers/joystream/joystream.hooks'
import { useSnackbar } from '@/providers/snackbars'
import { useTransactionManagerStore } from '@/providers/transactions/transactions.store'
import { useUser } from '@/providers/user/user.hooks'
import { useUserStore } from '@/providers/user/user.store'
import { uploadAvatarImage } from '@/utils/image'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'
import { formatNumber } from '@/utils/number'

import { MemberFormData, NewUserFormData } from './SignUpModal.types'

export const keyring = new Keyring({ type: 'sr25519', ss58Format: JOYSTREAM_ADDRESS_PREFIX })

export async function scryptHash(
  data: string,
  salt: Buffer | string,
  options: ScryptOpts = { N: 32768, r: 8, p: 1, dkLen: 32 }
): Promise<Buffer> {
  return new Promise((resolve) => {
    resolve(Buffer.from(scrypt(Buffer.from(data), salt, options)))
  })
}

export const useRegister = () => {
  const setUserId = useUserStore((store) => store.actions.setUserId)
  return useCallback(
    async (email: string, password: string, mnemonic: string, memberId: string) => {
      await cryptoWaitReady()
      const entropy = mnemonicToEntropy(mnemonic)

      const seed = u8aToHex(entropy)

      const id = (await scryptHash(`${email}:${password}`, '0x0818ee04c541716831bdd0f598fa4bbb')).toString('hex')
      const cipherIv = lib.WordArray.random(16).toString(enc.Hex)
      const cipherKey = await scryptHash(`${email}:${password}`, Buffer.from(hexToU8a(cipherIv)))
      const keyWA = enc.Hex.parse(cipherKey.toString('hex'))
      const ivWA = enc.Hex.parse(cipherIv)
      const wordArray = enc.Hex.parse(seed)

      const encrypted = AES.encrypt(wordArray, keyWA, { iv: ivWA, mode: mode.CBC })

      const keypair = keyring.addFromMnemonic(mnemonic)

      const registerPayload = {
        joystreamAccountId: keypair.address,
        memberId,
        gatewayName: 'Gleev',
        timestamp: Date.now(),
        action: 'createAccount',
        email,
        encryptionArtifacts: {
          id,
          encryptedSeed: encrypted.ciphertext.toString(enc.Hex),
          cipherIv,
        },
      }
      const registerSignature = u8aToHex(keypair.sign(JSON.stringify(registerPayload)))

      await axios.post(
        `${ORION_AUTH_URL}/account`,
        {
          payload: registerPayload,
          signature: registerSignature,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      setUserId('')
      return keypair.address
    },
    [setUserId]
  )
}

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
  data: NewUserFormData
  onStart: () => void
  onSuccess: () => void
  onError: () => void
}
export const useCreateMember = () => {
  const { refetchUserMemberships, setActiveUser } = useUser()
  const { joystream } = useJoystream()
  const addBlockAction = useTransactionManagerStore((state) => state.actions.addBlockAction)
  const { displaySnackbar } = useSnackbar()
  const [, setPreviouslyFailedData] = useState<MemberFormData | null>(null)

  const register = useRegister()

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

      // todo rename to mnemonic
      const keypair = keyring.addFromMnemonic(data.seed)

      const address = keypair.address

      // const address = await register(data.email, data.password, data.seed)

      try {
        const callback = async () => {
          const { data: memberShipData } = await refetchUserMemberships()
          const lastCreatedMembership = memberShipData.memberships[memberShipData.memberships.length - 1]
          if (lastCreatedMembership) {
            await register(data.email, data.password, data.seed, memberId.toString())
            setActiveUser({ accountId: address, memberId: lastCreatedMembership.id, channelId: null })
            displaySnackbar({
              title: 'Your membership has been created',
              description: 'Browse, watch, create, collect videos across the platform and have fun!',
              iconType: 'success',
            })
          }
          if (!joystream) {
            ConsoleLogger.error('No joystream instance')
            return
          }
          const { lockedBalance } = await joystream.getAccountBalance(address)
          const amountOfTokens = `${formatNumber(hapiBnToTokenNumber(new BN(lockedBalance)))} ${
            atlasConfig.joystream.tokenTicker
          }`
          displaySnackbar({
            title: `You received ${amountOfTokens}`,
            description: `Enjoy your ${amountOfTokens} tokens to help you cover transaction fees. These tokens are non-transferable and can't be spent on NFTs or other purchases.`,
            iconType: 'token',
          })
          onSuccess()
        }
        const { block, memberId } = await createNewMember(address, data)

        addBlockAction({ targetBlock: block, callback })
        setPreviouslyFailedData(null)
      } catch (error) {
        if (error.name === 'UploadAvatarServiceError') {
          displaySnackbar({
            title: 'Something went wrong',
            description: 'Avatar could not be uploaded. Try again later',
            iconType: 'error',
          })
          // goToPreviousStep(data)
          onError()
          SentryLogger.error('Failed to upload member avatar', 'SignInModal', error)
          return
        }

        const errorCode = isAxiosError<NewMemberErrorResponse>(error) ? error.response?.data?.error : null

        SentryLogger.error('Failed to create a membership', 'SignInModal', error, { error: { errorCode } })

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

        // goToPreviousStep(data)
        onError()
        return
      }
    },
    [addBlockAction, createNewMember, displaySnackbar, joystream, refetchUserMemberships, register, setActiveUser]
  )
  return handleSubmit
}
