import BN from 'bn.js'

import { HAPI_TO_JOY_RATE } from './config'
import { calculateAssetsSizeFee, hapiBnToTokenNumber, tokenNumberToHapiBn } from './utils'

const ONE_JOY_HAPIS = new BN(HAPI_TO_JOY_RATE)
const MAX_SAFE_NUMBER_JOY_HAPIS = new BN(Number.MAX_SAFE_INTEGER)
const MEGABYTE = 1024 * 1024

describe('hapiBnToTokenNumber', () => {
  it('should convert integer tokens', () => {
    const tokens = hapiBnToTokenNumber(ONE_JOY_HAPIS)
    expect(tokens).toEqual(1)
  })

  it('should convert fractional tokens', () => {
    const hapis = ONE_JOY_HAPIS.divn(2)
    const tokens = hapiBnToTokenNumber(hapis)
    expect(tokens).toEqual(0.5)
  })

  it('should convert very big (safe) tokens', () => {
    const hapis = ONE_JOY_HAPIS.mul(MAX_SAFE_NUMBER_JOY_HAPIS)
    const tokens = hapiBnToTokenNumber(hapis)
    expect(tokens).toEqual(Number.MAX_SAFE_INTEGER)
  })

  it('should fail to convert unsafe tokens', () => {
    const hapis = ONE_JOY_HAPIS.mul(MAX_SAFE_NUMBER_JOY_HAPIS.addn(1))
    expect(() => hapiBnToTokenNumber(hapis)).toThrowError()
  })
})

describe('tokenNumberToHapiBn', () => {
  it('should convert integer tokens', () => {
    const tokens = 1
    const hapis = tokenNumberToHapiBn(tokens)
    expect(hapis.toString()).toEqual(ONE_JOY_HAPIS.toString())
  })

  it('should convert fractional tokens', () => {
    const tokens = 0.5
    const hapis = tokenNumberToHapiBn(tokens)

    const expectedValue = ONE_JOY_HAPIS.divn(2)
    expect(hapis.toString()).toEqual(expectedValue.toString())
  })

  it('should convert very big (safe) tokens', () => {
    const tokens = Number.MAX_SAFE_INTEGER
    const hapis = tokenNumberToHapiBn(tokens)

    const expectedValue = ONE_JOY_HAPIS.mul(MAX_SAFE_NUMBER_JOY_HAPIS)
    expect(hapis.eq(expectedValue)).toEqual(true)
  })
})

describe('calculateAssetsSizeFee', () => {
  it('should calculate size fee for empty assets', () => {
    const fee = calculateAssetsSizeFee(new BN(1), {})
    expect(fee.toString()).toEqual('0')
  })

  it('should calculate size fee when fee is 0', () => {
    const fee = calculateAssetsSizeFee(new BN(0), {
      media: {
        size: 1000000,
        ipfsHash: '',
      },
    })
    expect(fee.toString()).toEqual('0')
  })

  it('should calculate size fee for one asset', () => {
    const assetSize = MEGABYTE * 100
    const fee = calculateAssetsSizeFee(new BN(MEGABYTE), {
      avatarPhoto: {
        ipfsHash: '',
        size: assetSize,
      },
    })
    expect(fee.toString()).toEqual(assetSize.toString())
  })

  it('should calculate size fee for multiple assets', () => {
    const assetSize1 = MEGABYTE * 100
    const assetSize2 = MEGABYTE * 200
    const assetSize3 = MEGABYTE * 300
    const fee = calculateAssetsSizeFee(new BN(MEGABYTE), {
      avatarPhoto: {
        ipfsHash: '',
        size: assetSize1,
      },
      coverPhoto: {
        ipfsHash: '',
        size: assetSize2,
      },
      media: {
        ipfsHash: '',
        size: assetSize3,
      },
    })
    expect(fee.toString()).toEqual((assetSize1 + assetSize2 + assetSize3).toString())
  })

  it('should work with huge (safe) asset size', () => {
    const maxSafeMegabytes = Number.MAX_SAFE_INTEGER % MEGABYTE
    const assetSize = MEGABYTE * maxSafeMegabytes
    const fee = calculateAssetsSizeFee(new BN(MEGABYTE), {
      avatarPhoto: {
        ipfsHash: '',
        size: assetSize,
      },
    })
    expect(fee.toString()).toEqual(assetSize.toString())
  })
})
