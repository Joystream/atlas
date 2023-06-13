import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types/.'
import { Keyring } from '@polkadot/keyring'
import { u8aToHex } from '@polkadot/util'
import { cryptoWaitReady, mnemonicToEntropy } from '@polkadot/util-crypto'
import axios from 'axios'

import { ORION_AUTH_URL } from '@/config/env'
import { encryptSeed } from '@/providers/auth/auth.helpers'
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

    const encryptionArtifacts = await encryptSeed({ seed, email, password })
    const keypair = keyring.addFromMnemonic(mnemonic)

    const registerPayload = {
      joystreamAccountId: keypair.address,
      memberId,
      gatewayName: 'Gleev',
      timestamp: Date.now() - 20_000,
      action: 'createAccount',
      email,
      encryptionArtifacts,
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
