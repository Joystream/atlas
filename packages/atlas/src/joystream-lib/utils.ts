import { DeriveBalancesAll } from '@polkadot/api-derive/balances/types'
import BN from 'bn.js'

import { HAPI_TO_JOY_RATE } from '@/joystream-lib/config'
import { AccountBalanceInfo, ChannelInputAssets, VideoInputAssets } from '@/joystream-lib/types'
import { ConsoleLogger } from '@/utils/logs'

const MAX_SAFE_NUMBER_BN = new BN(Number.MAX_SAFE_INTEGER)
const HAPI_TO_JOY_RATE_BN = new BN(HAPI_TO_JOY_RATE)

export const hapiBnToTokenNumber = (bn: BN, roundUpToTwoDecimalPlaces?: boolean) => {
  const wholeUnitsBn = bn.div(HAPI_TO_JOY_RATE_BN)
  const fractionalUnitsBn = bn.mod(HAPI_TO_JOY_RATE_BN)

  if (wholeUnitsBn.gt(MAX_SAFE_NUMBER_BN)) {
    throw new Error('Trying to convert unsafe number from BN to number')
  }

  const wholeUnits = wholeUnitsBn.toNumber()
  const fractionalHapiUnits = fractionalUnitsBn.toNumber()
  const fractionalJoyUnits = fractionalHapiUnits / HAPI_TO_JOY_RATE
  if (roundUpToTwoDecimalPlaces) {
    return Math.ceil((wholeUnits + fractionalJoyUnits) * 100) / 100
  }
  return wholeUnits + fractionalJoyUnits
}

export const tokenNumberToHapiBn = (rawNumber: number) => {
  let number = rawNumber
  if (rawNumber > Number.MAX_SAFE_INTEGER) {
    ConsoleLogger.warn('Trying to convert unsafe number to BN, will cap at MAX_SAFE_INTEGER')
    number = Number.MAX_SAFE_INTEGER
  }
  const wholeUnits = Math.floor(number)
  const wholeUnitsBn = new BN(wholeUnits)
  const wholeHapiUnitsBn = wholeUnitsBn.mul(HAPI_TO_JOY_RATE_BN)

  const fractionalUnits = number % 1
  const fractionalHapiUnitsBn = new BN(fractionalUnits * HAPI_TO_JOY_RATE)

  return wholeHapiUnitsBn.add(fractionalHapiUnitsBn)
}

export const calculateAssetsSizeFee = (
  dataObjectPerMegabyteFee: BN,
  assets?: VideoInputAssets | ChannelInputAssets
): BN => {
  if (!assets) {
    return new BN(0)
  }

  const totalBytes = Object.values(assets)
    .flat()
    .reduce((acc, asset) => {
      return acc + asset.size
    }, 0)

  const totalMegabytes = new BN(totalBytes).divn(1024 * 1024)
  return dataObjectPerMegabyteFee.mul(totalMegabytes)
}

export const calculateAssetsBloatFee = (
  dataObjectStateBloatBondValue: BN,
  assets?: VideoInputAssets | ChannelInputAssets
) => {
  if (!assets) {
    return new BN(0)
  }
  return dataObjectStateBloatBondValue.muln(Object.values(assets).length)
}

export const parseAccountBalance = (balances: DeriveBalancesAll): AccountBalanceInfo => {
  /*
    balances.freeBalance = all the tokens in the account
    feeUsable = balance usable for paying fees
    more here: 
    https://gist.github.com/Lezek123/88b85b6af866feaa4f6b5064ce528a93
  */

  const feeUsable = balances.freeBalance.sub(balances.frozenFee)

  const lockedBalance = feeUsable.sub(balances.availableBalance)
  return {
    availableBalance: balances.availableBalance.toString(),
    lockedBalance: lockedBalance.toString(),
    totalInvitationLock:
      balances.lockedBreakdown.find((lock) => lock.id.toUtf8() === 'invitemb')?.amount.toString() ?? '0',
  }
}
