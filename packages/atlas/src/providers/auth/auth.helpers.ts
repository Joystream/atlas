import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types'
import { ScryptOpts, scrypt } from '@noble/hashes/scrypt'
import { Keyring } from '@polkadot/keyring'
import axios, { isAxiosError } from 'axios'
import { entropyToMnemonic } from 'bip39'
import { Buffer } from 'buffer'
import { AES, enc, lib, mode } from 'crypto-js'

import { ORION_AUTH_URL } from '@/config/env'
import { getWalletsList } from '@/providers/wallet/wallet.helpers'
import { SentryLogger } from '@/utils/logs'

import { AuthModals } from './auth.types'

export const handleAnonymousAuth = async (userId?: string | null) => {
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

export const getArtifacts = async (id: string, email: string, password: string) => {
  const keyring = new Keyring({ type: 'sr25519', ss58Format: JOYSTREAM_ADDRESS_PREFIX })

  try {
    const res = await axios.get<{ cipherIv: string; encryptedSeed: string }>(
      `${ORION_AUTH_URL}/artifacts?id=${id}&email=${encodeURIComponent(email)}`
    )
    const { cipherIv, encryptedSeed } = res.data
    const cipherKey = await scryptHash(`${email}:${password}`, Buffer.from(cipherIv, 'hex'))
    const decryptedSeed = aes256CbcDecrypt(encryptedSeed, cipherKey, Buffer.from(cipherIv, 'hex'))
    const mnemonic = seedToMnemonic(decryptedSeed)
    const keypair = keyring.addFromMnemonic(mnemonic)
    return {
      keypair,
      decryptedSeed,
    }
  } catch (error) {
    SentryLogger.error('Error when fetching artifacts', 'useLogIn', error)
  }
}

export const seedToMnemonic = (hexSeed: string) =>
  entropyToMnemonic(Buffer.from(hexSeed.slice(2, hexSeed.length), 'hex'))

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

export const decodeSessionEncodedSeedToMnemonic = async (encodedSeed: string) => {
  try {
    const { data } = await axios.get(`${ORION_AUTH_URL}/session-artifacts`, { withCredentials: true })

    if (!(data.cipherKey || data.cipherIv)) {
      return null
    }

    const { cipherKey, cipherIv } = data
    const decryptedSeed = aes256CbcDecrypt(encodedSeed, Buffer.from(cipherKey, 'hex'), Buffer.from(cipherIv, 'hex'))
    return entropyToMnemonic(Buffer.from(decryptedSeed.slice(2, decryptedSeed.length), 'hex'))
  } catch (e) {
    if (isAxiosError(e) && e.response?.data.message === 'isAxiosError') {
      logoutRequest()
    }
    return null
  }
}

export const logoutRequest = () => axios.post(`${ORION_AUTH_URL}/logout`, {}, { withCredentials: true })

export const getCorrectLoginModal = (): AuthModals => {
  const hasAtleastOneWallet = getWalletsList().some((wallet) => wallet.installed)
  return hasAtleastOneWallet ? 'externalLogIn' : 'logIn'
}
