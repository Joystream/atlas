import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types/.'
import { Keyring } from '@polkadot/keyring'
import { hexToU8a, u8aToHex } from '@polkadot/util'
import { cryptoWaitReady, mnemonicToEntropy } from '@polkadot/util-crypto'
import axios from 'axios'
import { Buffer } from 'buffer'
import { AES, enc, lib, mode } from 'crypto-js'

import { ORION_AUTH_URL } from '@/config/env'
import { scryptHash } from '@/providers/auth/auth.helpers'
import { isAxiosError } from '@/utils/error'

type OrionAccountErrorArgs = {
  message?: string
  details?: unknown
  status?: number
}

export class OrionAccountError extends Error {
  details: unknown
  status?: number
  constructor({ message, details, status }: OrionAccountErrorArgs) {
    super(message)
    this.details = details
    this.status = status
  }
}

export const keyring = new Keyring({ type: 'sr25519', ss58Format: JOYSTREAM_ADDRESS_PREFIX })

export const registerAccount = async (email: string, password: string, mnemonic: string, memberId: string) => {
  try {
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
      timestamp: Date.now() - 20_000,
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

    return keypair.address
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
