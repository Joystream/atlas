import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types/.'
import { Keyring } from '@polkadot/keyring'
import { KeyringPair } from '@polkadot/keyring/types'
import { hexToU8a, u8aToHex } from '@polkadot/util'
import { cryptoWaitReady, mnemonicToEntropy } from '@polkadot/util-crypto'
import axios from 'axios'
import { Buffer } from 'buffer'
import { AES, enc, lib, mode } from 'crypto-js'
import { useCallback } from 'react'

import { ORION_AUTH_URL } from '@/config/env'
import { useLogIn } from '@/hooks/useLogIn'
import { scryptHash } from '@/utils/user'

export const keyring = new Keyring({ type: 'sr25519', ss58Format: JOYSTREAM_ADDRESS_PREFIX })

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

export const useRegister = () => {
  const handleLogin = useLogIn()

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
        const entropy = mnemonicToEntropy(mnemonic)
        const seed = u8aToHex(entropy)

        const id = (await scryptHash(`${email}:${password}`, '0x0818ee04c541716831bdd0f598fa4bbb')).toString('hex')
        const cipherIv = lib.WordArray.random(16).toString(enc.Hex)
        const cipherKey = await scryptHash(`${email}:${password}`, Buffer.from(hexToU8a(cipherIv)))
        const keyWA = enc.Hex.parse(cipherKey.toString('hex'))
        const ivWA = enc.Hex.parse(cipherIv)
        const wordArray = enc.Hex.parse(seed)

        const encrypted = AES.encrypt(wordArray, keyWA, { iv: ivWA, mode: mode.CBC })

        await axios.post(`${ORION_AUTH_URL}/artifacts`, {
          cipherIv,
          id,
          encryptedSeed: encrypted.ciphertext.toString(enc.Hex),
        })

        keypair = keyring.addFromMnemonic(mnemonic)
        registerPayload.encryptionArtifacts = {
          cipherIv,
          id,
          encryptedSeed: encrypted.ciphertext.toString(enc.Hex),
        }
        registerPayload.joystreamAccountId = keypair.address
        registerSignature = u8aToHex(keypair.sign(JSON.stringify(registerPayload)))
      }

      if (params.type === 'extension') {
        registerPayload.joystreamAccountId = params.address
        registerPayload.email = params.email
        registerSignature = await params.signature(JSON.stringify(registerPayload))
      }

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

      await handleLogin({
        type: 'extension',
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
