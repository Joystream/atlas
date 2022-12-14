import { hexToU8a, isHex } from '@polkadot/util'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'

import { JOYSTREAM_SS58_PREFIX } from '@/joystream-lib/config'

export const isValidAddressPolkadotAddress = (address: string) => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address))
    return true
  } catch (error) {
    return false
  }
}

export const formatJoystreamAddress = (address: string) => {
  const publicKey = decodeAddress(address)
  return encodeAddress(publicKey, JOYSTREAM_SS58_PREFIX)
}
