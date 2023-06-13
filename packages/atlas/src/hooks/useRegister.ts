import { KeyringPair } from '@polkadot/keyring/types'
import { u8aToHex } from '@polkadot/util'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import axios from 'axios'
import { useCallback } from 'react'

import { ORION_AUTH_URL } from '@/config/env'
import { keyring } from '@/joystream-lib/lib'
import { prepareEncryptionArtifacts } from '@/providers/auth/auth.helpers'
import { useAuth } from '@/providers/auth/auth.hooks'

type EncryptionArtifacts = {
  id: string
  encryptedSeed: string
  cipherIv: string
}

type RegisterPayload = {
  joystreamAccountId: string
  gatewayName: string
  timestamp: number
  action: 'createAccount'
  memberId: string
  email: string
  encryptionArtifacts?: EncryptionArtifacts
}

type ExtensionParams = {
  type: 'extension'
  signature: (payload: string) => Promise<string | undefined>
  email: string
  address: string
  memberId: string
}

type EmailPasswordParams = {
  type: 'emailPassword'
  email: string
  password: string
  mnemonic: string
  memberId: string
}

type RegisterParams = ExtensionParams | EmailPasswordParams

export enum RegisterError {
  EmailAlreadyExists = 'EmailAlreadyExists',
  UnknownError = 'UnknownError',
}

export const useRegister = () => {
  const { handleLogin } = useAuth()

  return useCallback(
    async (params: RegisterParams) => {
      await cryptoWaitReady()
      const registerPayload: RegisterPayload = {
        gatewayName: 'Gleev',
        memberId: params.memberId,
        joystreamAccountId: '',
        timestamp: Date.now(),
        action: 'createAccount',
        email: params.email,
      }
      let registerSignature = null
      let keypair: KeyringPair | null = null
      if (params.type === 'emailPassword') {
        const { email, password, mnemonic } = params
        const artifacts = await prepareEncryptionArtifacts(email, password, mnemonic)

        await axios.post(`${ORION_AUTH_URL}/artifacts`, artifacts)

        keypair = keyring.addFromMnemonic(mnemonic)
        registerPayload.encryptionArtifacts = artifacts
        registerPayload.joystreamAccountId = keypair.address
        registerSignature = u8aToHex(keypair.sign(JSON.stringify(registerPayload)))
      }

      if (params.type === 'extension') {
        registerPayload.joystreamAccountId = params.address
        registerPayload.email = params.email
        registerSignature = await params.signature(JSON.stringify(registerPayload))
      }
      try {
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
      } catch (e) {
        if (e.response.data.message === 'Account with the provided e-mail address already exists.') {
          throw new Error(RegisterError.EmailAlreadyExists)
        }
        throw new Error(RegisterError.UnknownError)
      }

      await handleLogin({
        type: 'external',
        address: registerPayload.joystreamAccountId,
        sign:
          params.type === 'extension'
            ? params.signature
            : (data) => Promise.resolve(u8aToHex(keypair?.sign(JSON.stringify(data)) ?? new Uint8Array())),
      })
    },
    [handleLogin]
  )
}
