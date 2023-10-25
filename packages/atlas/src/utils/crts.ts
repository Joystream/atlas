import BN from 'bn.js'

import { hapiBnToTokenNumber } from '@/joystream-lib/utils'

export const calcMarketPricePerToken = (_totalSupply?: string, ammSlopeParameter?: string, ammInitPrice?: string) => {
  if (!_totalSupply || !ammSlopeParameter || !ammInitPrice) return
  const totalSupply = new BN(_totalSupply)
  return hapiBnToTokenNumber(new BN(ammSlopeParameter).mul(totalSupply).add(new BN(ammInitPrice)))
}
