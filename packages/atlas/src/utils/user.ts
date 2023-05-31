import { ScryptOpts, scrypt } from '@noble/hashes/scrypt'
import axios from 'axios'
import { Buffer } from 'buffer'
import { AES, enc, lib, mode } from 'crypto-js'

import { ORION_AUTH_URL } from '@/config/env'

import { SentryLogger } from './logs'

export const setAnonymousAuth = async (userId?: string | null) => {
  try {
    const response = await axios.post<{
      success: boolean
      userId: string
    }>(
      `${ORION_AUTH_URL}/anonymous-auth`,
      { ...(userId ? { userId: userId } : {}) },
      {
        method: 'POST',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    if (response.data.userId && response.data.success) {
      return response.data.userId
    }
  } catch (error) {
    SentryLogger.error('Error during fetching user id', 'setAnonymousAuth', error)
  }
}

export const getArtifacts = async (id: string, email: string) => {
  try {
    const res = await axios.get<{ cipherIv: string; encryptedSeed: string }>(
      `${ORION_AUTH_URL}/artifacts?id=${id}&email=${email}`
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
