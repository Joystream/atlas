import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types'
import { ScryptOpts, scrypt } from '@noble/hashes/scrypt'
import { Keyring } from '@polkadot/keyring'
import { u8aToHex } from '@polkadot/util'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import axios from 'axios'
import { entropyToMnemonic } from 'bip39'
import { Buffer } from 'buffer'
import { AES, enc, lib, mode } from 'crypto-js'
import { useCallback } from 'react'

import { ORION_AUTH_URL } from '@/config/env'
import { SentryLogger } from '@/utils/logs'

export const getArtifacts = async (id: string, email: string) => {
  try {
    const res = await axios.get<{ cipherIv: string; encryptedSeed: string }>(
      `${ORION_AUTH_URL}/artifacts?id=${id}&email=${encodeURIComponent(email)}`
    )

    return res.data
  } catch (error) {
    SentryLogger.error('Error when fetching artifacts', 'useLogIn', error)
  }
}

export async function scryptHash(
  data: string,
  salt: Buffer | string,
  options: ScryptOpts = { N: 32768, r: 8, p: 1, dkLen: 32 }
): Promise<Buffer> {
  return new Promise((resolve) => {
    resolve(Buffer.from(scrypt(Buffer.from(data), salt, options)))
  })
}

export function aes256CbcDecrypt(encryptedData: string, key: Buffer, iv: Buffer): string {
  const keyWA = enc.Hex.parse(key.toString('hex'))
  const ivWA = enc.Hex.parse(iv.toString('hex'))
  const decrypted = AES.decrypt(lib.CipherParams.create({ ciphertext: enc.Hex.parse(encryptedData) }), keyWA, {
    iv: ivWA,
    mode: mode.CBC,
  })
  return decrypted.toString(enc.Hex)
}

export const keyring = new Keyring({ type: 'sr25519', ss58Format: JOYSTREAM_ADDRESS_PREFIX })

export enum LogInErrors {
  ArtifactsNotFound = 'ArtifactsNotFound',
  NoAccountFound = 'NoAccountFound',
  InvalidPayload = 'InvalidPayload',
  LoginError = 'LoginError',
}

type LogInHandler = {
  data: {
    accountId: string
  } | null
  error?: LogInErrors
}

type EmailPasswordLogin = {
  type: 'emailPassword'
  email: string
  password: string
}

type ExtensionLogin = {
  type: 'extension'
  sign: (payload: string) => Promise<string | undefined>
  address: string
}

type LoginParams = EmailPasswordLogin | ExtensionLogin

export const useLogIn = () => {
  return useCallback(async (params: LoginParams): Promise<LogInHandler> => {
    await cryptoWaitReady()
    const time = Date.now() - 1000
    const payload = {
      joystreamAccountId: '',
      gatewayName: 'Gleev',
      timestamp: time,
      action: 'login',
    }
    let signatureOverPayload = null
    if (params.type === 'emailPassword') {
      const { email, password } = params
      const id = (await scryptHash(`${email}:${password}`, '0x0818ee04c541716831bdd0f598fa4bbb')).toString('hex')
      const data = await getArtifacts(id, email)
      if (!data) {
        return {
          data: null,
          error: LogInErrors.ArtifactsNotFound,
        }
      }

      const { cipherIv, encryptedSeed } = data
      const cipherKey = await scryptHash(`${email}:${password}`, Buffer.from(cipherIv, 'hex'))
      const decryptedSeed = aes256CbcDecrypt(encryptedSeed, cipherKey, Buffer.from(cipherIv, 'hex'))
      const keypair = keyring.addFromMnemonic(
        entropyToMnemonic(Buffer.from(decryptedSeed.slice(2, decryptedSeed.length), 'hex'))
      )
      payload.joystreamAccountId = keypair.address
      signatureOverPayload = u8aToHex(keypair.sign(JSON.stringify(payload)))
    }

    if (params.type === 'extension') {
      payload.joystreamAccountId = params.address
      signatureOverPayload = await params.sign(JSON.stringify(payload))
    }

    try {
      const response = await axios.post<{ accountId: string }>(
        `${ORION_AUTH_URL}/login`,
        {
          signature: signatureOverPayload,
          payload,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      return {
        data: response.data,
      }
    } catch (error) {
      const orionMessage = error.response.data.message
      if (orionMessage.includes('Invalid credentials')) {
        return {
          data: null,
          error: LogInErrors.NoAccountFound,
        }
      }

      if (orionMessage.includes('Payload signature is invalid.')) {
        return {
          data: null,
          error: LogInErrors.InvalidPayload,
        }
      }

      SentryLogger.error('Unsupported error when posting login action', 'useLogIn', error)
      return {
        data: null,
        error: LogInErrors.LoginError,
      }
    }
  }, [])
}
