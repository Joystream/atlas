import { ScryptOpts, scrypt } from '@noble/hashes/scrypt'
import { cryptoWaitReady, sr25519PairFromSeed, sr25519Sign } from '@polkadot/util-crypto'
import axios from 'axios'
import { Buffer } from 'buffer'
import { AES, enc } from 'crypto-js'
import { useCallback } from 'react'

import { atlasConfig } from '@/config'
import { SentryLogger } from '@/utils/logs'

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
  const decrypted = AES.decrypt(encryptedData, keyHex, {
    iv: ivHex,
  })
  return decrypted.toString(enc.Utf8)
}

export const useLogIn = () => {
  const getArtifacts = async (id: string) => {
    try {
      // todo fix typing
      const res = await axios.get<{ cipherIv: any; encryptedSeed: any }>(
        `https://atlas-dev.joystream.org/orion-auth/api/v1/artifacts?id=${id}`
      )

      return res.data
    } catch (error) {
      SentryLogger.error('Error when fetching artifacts', 'useLogIn', error)
    }
  }
  return useCallback(async (email: string, password: string) => {
    await cryptoWaitReady()
    const id = (await scryptHash(`lookupKey:${email}:${password}`, 'lookupKeySalt')).toString('hex')
    const data = await getArtifacts(id)
    if (!data) {
      return
    }
    const { cipherIv, encryptedSeed } = data
    const cipherKey = await scryptHash(`cipherKey:${email}:${password}`, Buffer.from(cipherIv, 'hex'))
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
      const {
        data: { accountId },
      } = await axios.post<{ accountId: string }>('https://atlas-dev.joystream.org/orion-auth/api/v1/login', {
        signature: signatureOverPayload,
        payload,
      })

      return accountId
    } catch (error) {
      SentryLogger.error('Error when posting login action', 'useLogIn', error)
    }
  }, [])
}
