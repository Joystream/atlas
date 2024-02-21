import { ScryptOpts, scrypt } from '@noble/hashes/scrypt'
import { KeyringPair } from '@polkadot/keyring/types'
import { hexToU8a, u8aToHex } from '@polkadot/util'
import { mnemonicToEntropy as _mnemonicToEntropy, cryptoWaitReady } from '@polkadot/util-crypto'
import { isAxiosError } from 'axios'
import { entropyToMnemonic as _entropyToMnemonic } from 'bip39'
import { Buffer } from 'buffer'
import { AES, enc, lib, mode } from 'crypto-js'

import { axiosInstance } from '@/api/axios'
import { atlasConfig } from '@/config'
import { ORION_AUTH_URL } from '@/config/env'
import { keyring } from '@/joystream-lib/lib'
import { getWalletsList } from '@/providers/wallet/wallet.helpers'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'
import { withTimeout } from '@/utils/misc'

import { AuthModals, LogInErrors, OrionAccountError, RegisterParams, RegisterPayload } from './auth.types'

export const getArtifactId = async (email: string, password: string) => {
  return (await scryptHash(`${email}:${password}`, '0x0818ee04c541716831bdd0f598fa4bbb')).toString('hex')
}

export const handleAnonymousAuth = async (userId?: string | null) => {
  try {
    const response = await axiosInstance.post<{
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
  try {
    const res = await axiosInstance.get<{ cipherIv: string; encryptedSeed: string }>(
      `${ORION_AUTH_URL}/artifacts?id=${id}&email=${encodeURIComponent(email)}`
    )
    const { cipherIv, encryptedSeed: encryptedEntropy } = res.data
    const cipherKey = await scryptHash(`${email}:${password}`, Buffer.from(cipherIv, 'hex'))
    const decryptedEntropy = aes256CbcDecrypt(encryptedEntropy, cipherKey, Buffer.from(cipherIv, 'hex'))
    const mnemonic = entropyToMnemonic(decryptedEntropy)

    const keypair = keyring.addFromMnemonic(mnemonic)
    return {
      keypair,
      decryptedEntropy,
    }
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      throw new Error(LogInErrors.ArtifactsNotFound)
    }
    throw new Error(LogInErrors.UnknownError)
  }
}

export const entropyToMnemonic = (hexSeed: string) =>
  _entropyToMnemonic(Buffer.from(hexSeed.slice(2, hexSeed.length), 'hex'))

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
    const { data } = await axiosInstance.get(`${ORION_AUTH_URL}/session-artifacts`, { withCredentials: true })

    if (!(data.cipherKey || data.cipherIv)) {
      return null
    }

    const { cipherKey, cipherIv } = data
    const decryptedSeed = aes256CbcDecrypt(encodedSeed, Buffer.from(cipherKey, 'hex'), Buffer.from(cipherIv, 'hex'))
    return _entropyToMnemonic(Buffer.from(decryptedSeed.slice(2, decryptedSeed.length), 'hex'))
  } catch (e) {
    if (isAxiosError(e) && e.response?.data.message === 'isAxiosError') {
      logoutRequest().catch((error) => ConsoleLogger.warn('Failed to logout on decoding error', error))
    }
    return null
  }
}

export const loginRequest = (
  signature: string,
  payload: {
    joystreamAccountId: string
    gatewayName: string
    timestamp: number
    action: 'login'
  }
) =>
  axiosInstance.post<{ accountId: string }>(
    `${ORION_AUTH_URL}/login`,
    {
      signature,
      payload,
    },
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

export const logoutRequest = () => axiosInstance.post(`${ORION_AUTH_URL}/logout`, {}, { withCredentials: true })

export const getCorrectLoginModal = (): AuthModals => {
  const hasAtLeastOneWallet = getWalletsList().some(
    (wallet) => wallet.extensionName !== 'WalletConnect' && wallet.installed
  )
  return hasAtLeastOneWallet ? 'externalLogIn' : 'logIn'
}

export const prepareEncryptionArtifacts = async (email: string, password: string, mnemonic: string) => {
  try {
    const entropy = _mnemonicToEntropy(mnemonic)
    const seed = u8aToHex(entropy)

    const id = await getArtifactId(email, password)
    const cipherIv = lib.WordArray.random(16).toString(enc.Hex)
    const cipherKey = await scryptHash(`${email}:${password}`, Buffer.from(hexToU8a(cipherIv)))
    const keyWA = enc.Hex.parse(cipherKey.toString('hex'))
    const ivWA = enc.Hex.parse(cipherIv)
    const wordArray = enc.Hex.parse(seed)

    const encrypted = AES.encrypt(wordArray, keyWA, { iv: ivWA, mode: mode.CBC })

    return {
      id,
      cipherIv,
      encryptedSeed: encrypted.ciphertext.toString(enc.Hex),
    }
  } catch (error) {
    SentryLogger.error('Error during preparing encryption artifacts', 'prepareEncryptionArtifacts', error)
  }
}

export const registerAccount = async (params: RegisterParams) => {
  try {
    await cryptoWaitReady()
    const timestamp = (await getAuthEpoch()) - 30_000
    const registerPayload: RegisterPayload = {
      gatewayName: 'Gleev',
      memberId: params.memberId,
      joystreamAccountId: '',
      timestamp,
      action: 'createAccount',
      email: params.email,
    }
    let registerSignature = null
    let keypair: KeyringPair | null = null
    if (params.type === 'internal') {
      const { email, password, mnemonic } = params
      const encryptionArtifacts = await prepareEncryptionArtifacts(email, password, mnemonic)

      keypair = keyring.addFromMnemonic(mnemonic)
      registerPayload.encryptionArtifacts = encryptionArtifacts
      registerPayload.joystreamAccountId = keypair.address
      registerSignature = u8aToHex(keypair.sign(JSON.stringify(registerPayload)))
    }

    if (params.type === 'external') {
      registerPayload.joystreamAccountId = params.address
      registerPayload.email = params.email
      registerSignature = await params.signature(JSON.stringify(registerPayload))
    }
    await axiosInstance.post(
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

    return registerPayload.joystreamAccountId
  } catch (error) {
    if (!isAxiosError<{ message?: string }>(error)) {
      throw new OrionAccountError({ details: error, message: 'Something went wrong' })
    }
    const errorMessage = error.response?.data?.message
    throw new OrionAccountError({
      details: error,
      message: errorMessage || 'Something went wrong',
      status: error.response?.status,
    })
  }
}

type ChangePasswordArgs = {
  joystreamAccountId: string
  gatewayAccountId: string
  email: string
  mnemonic: string
  newPassword: string
}
export const changePassword = async ({
  email,
  newPassword,
  mnemonic,
  joystreamAccountId,
  gatewayAccountId,
}: ChangePasswordArgs) => {
  try {
    const keypair = keyring.addFromMnemonic(mnemonic)
    const newArtifacts = await prepareEncryptionArtifacts(email, newPassword, mnemonic)
    const timestamp = (await getAuthEpoch()) - 30_000
    const changePasswordPayload = {
      joystreamAccountId,
      gatewayName: atlasConfig.general.appName,
      timestamp,
      action: 'changeAccount',
      gatewayAccountId,
      newArtifacts,
    }

    const signatureOverPayload = u8aToHex(keypair.sign(JSON.stringify(changePasswordPayload)))

    return axiosInstance.post(
      `${ORION_AUTH_URL}/change-account`,
      {
        signature: signatureOverPayload,
        payload: changePasswordPayload,
      },
      { withCredentials: true }
    )
  } catch (error) {
    SentryLogger.error('Something went wrong during changing password', 'changePassword', error)
  }
}

export const getMnemonicFromeEmailAndPassword = async (email: string, password: string) => {
  const id = await getArtifactId(email, password)
  const data = await getArtifacts(id, email, password)
  if (!data?.decryptedEntropy) {
    throw Error("Couldn't fetch artifacts")
  }
  return entropyToMnemonic(data?.decryptedEntropy)
}

export const getAuthEpoch = async () => {
  let epoch: number
  try {
    const res = await withTimeout(axiosInstance.get('https://worldtimeapi.org/api/ip'), 5_000)
    if (res.data?.unixtime) {
      epoch = res.data.unixtime * 1000
    } else {
      epoch = Date.now()
    }
  } catch (error) {
    epoch = Date.now()
    SentryLogger.error('Error fetching auth epoch time', 'getAuthEpoch', {
      error,
    })
  }

  return epoch
}
