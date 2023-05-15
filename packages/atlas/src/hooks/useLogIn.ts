import { ScryptOpts, scrypt } from '@noble/hashes/scrypt'
import { cryptoWaitReady, sr25519PairFromSeed, sr25519Sign } from '@polkadot/util-crypto'
import axios from 'axios'
import { Buffer } from 'buffer'
import { AES, enc } from 'crypto-js'
import { useCallback } from 'react'

import { atlasConfig } from '@/config'
import { ORION_AUTH_URL } from '@/config/env'
import { SentryLogger } from '@/utils/logs'

// todo extract these 3 Fn to `packages/atlas/src/utils/user.ts` after #4168 is merged
export async function scryptHash(
  data: string,
  salt: Buffer | string,
  options: ScryptOpts = { N: 32768, r: 8, p: 1, dkLen: 32 }
): Promise<Buffer> {
  return new Promise((resolve) => {
    resolve(Buffer.from(scrypt(Buffer.from(data), salt, options)))
  })
}

function aes256CbcDecrypt(encryptedData: string, key: Buffer, iv: Buffer): string {
  const keyHex = enc.Hex.parse(key.toString('hex'))
  const ivHex = enc.Hex.parse(iv.toString('hex'))
  const decrypted = AES.decrypt(encryptedData, keyHex, { iv: ivHex })
  return decrypted.toString(enc.Utf8)
}

const getArtifacts = async (id: string) => {
  try {
    const res = await axios.get<{ cipherIv: any; encryptedSeed: any }>(`${ORION_AUTH_URL}/artifacts?id=${id}`)

    return res.data
  } catch (error) {
    SentryLogger.error('Error when fetching artifacts', 'useLogIn', error)
  }
}

export enum LogInErrors {
  ArtifactsNotFound = 'ArtifactsNotFound',
  LoginError = 'LoginError',
}

type LogInHandler = {
  data: {
    accountId: string
  } | null
  error?: LogInErrors
}

export const useLogIn = () => {
  return useCallback(async (email: string, password: string): Promise<LogInHandler> => {
    await cryptoWaitReady()
    const id = (await scryptHash(`${email}:${password}`, '0x4f7242b39969c3ac4c6712524d633ce9')).toString('hex')
    const data = await getArtifacts(id)
    if (!data) {
      return {
        data: null,
        error: LogInErrors.ArtifactsNotFound,
      }
    }
    const { cipherIv, encryptedSeed } = data
    const cipherKey = await scryptHash(`${email}:${password}`, Buffer.from(cipherIv, 'hex'))
    const decryptedSeed = aes256CbcDecrypt(encryptedSeed, cipherKey, Buffer.from(cipherIv, 'hex'))
    const keypair = sr25519PairFromSeed(decryptedSeed)
    const payload = {
      joystreamAccountId: keypair.publicKey,
      gatewayName: atlasConfig.general.appName,
      timestamp: Date.now(),
      action: 'login',
    }
    const signatureOverPayload = sr25519Sign(JSON.stringify(payload), keypair)
    try {
      const response = await axios.post<{ accountId: string }>(`${ORION_AUTH_URL}/login`, {
        signature: signatureOverPayload,
        payload,
      })

      return {
        data: response.data,
      }
    } catch (error) {
      SentryLogger.error('Error when posting login action', 'useLogIn', error)
      return {
        data: null,
        error: LogInErrors.LoginError,
      }
    }
  }, [])
}
