import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types/.'
import { ScryptOpts, scrypt } from '@noble/hashes/scrypt'
import { Keyring } from '@polkadot/keyring'
import { hexToU8a, u8aToHex } from '@polkadot/util'
import { cryptoWaitReady, mnemonicToEntropy } from '@polkadot/util-crypto'
import axios from 'axios'
import { Buffer } from 'buffer'
import { AES, enc, lib, mode } from 'crypto-js'
import { useCallback } from 'react'

import { atlasConfig } from '@/config'
import { ORION_AUTH_URL } from '@/config/env'
import { useUserStore } from '@/providers/user/user.store'

export const keyring = new Keyring({ type: 'sr25519', ss58Format: JOYSTREAM_ADDRESS_PREFIX })

export async function scryptHash(
  data: string,
  salt: Buffer | string,
  options: ScryptOpts = { N: 32768, r: 8, p: 1, dkLen: 32 }
): Promise<Buffer> {
  return new Promise((resolve) => {
    resolve(Buffer.from(scrypt(Buffer.from(data), salt, options)))
  })
}

export const useRegister = () => {
  const setUserId = useUserStore((store) => store.actions.setUserId)
  return useCallback(
    async (email: string, password: string, mnemonic: string) => {
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

      await axios.post(`${ORION_AUTH_URL}/artifacts`, {
        cipherIv,
        id,
        encryptedSeed: encrypted.ciphertext.toString(enc.Hex),
      })

      const keypair = keyring.addFromMnemonic(mnemonic)

      const registerPayload = {
        gatewayName: 'Gleev',
        joystreamAccountId: keypair.address,
        timestamp: Date.now(),
        action: 'createAccount',
        email,
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

      const loginPayload = {
        action: 'login',
        gatewayName: atlasConfig.general.appName,
        joystreamAccountId: keypair.address,
        timestamp: Date.now(),
      }

      const loginSignature = u8aToHex(keypair.sign(JSON.stringify(loginPayload)))
      await axios.post(
        `${ORION_AUTH_URL}/login`,
        {
          payload: loginPayload,
          signature: loginSignature,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      setUserId('')
    },
    [setUserId]
  )
}
