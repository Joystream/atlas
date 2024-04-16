import BN from 'bn.js'

export const calcBuyMarketPricePerToken = (
  mintedByAmm?: string | number,
  ammSlopeParameter?: string,
  ammInitPrice?: string,
  amount: number | string = 1
) => {
  if (mintedByAmm === undefined || !ammSlopeParameter || !ammInitPrice) return
  const bnAmount = new BN(amount)
  const totalSupply = new BN(mintedByAmm)
  const allocation = totalSupply
    .add(bnAmount)
    .pow(new BN(2))
    .sub(totalSupply.pow(new BN(2)))
  return new BN(ammSlopeParameter).mul(allocation).divn(2).add(new BN(ammInitPrice).mul(bnAmount))
}

export const calcSellMarketPricePerToken = (
  mintedByAmm?: string | number,
  ammSlopeParameter?: string,
  ammInitPrice?: string,
  amount = 1
) => {
  if (!mintedByAmm || !ammSlopeParameter || !ammInitPrice) return
  if (amount > +mintedByAmm) {
    return new BN(0)
  }
  const totalSupply = new BN(mintedByAmm)
  const allocation = totalSupply.pow(new BN(2)).sub(totalSupply.subn(amount).pow(new BN(2)))
  return new BN(ammSlopeParameter).mul(allocation).divn(2).add(new BN(ammInitPrice).muln(amount))
}

type GetRevenueShareStatusForMemberProps = {
  currentBlock: number
  startingAt: number
  endingAt: number
  hasMemberStaked: boolean
  hasRecovered: boolean
  isFinalized: boolean
}

export const getRevenueShareStatusForMember = ({
  currentBlock,
  startingAt,
  endingAt,
  hasMemberStaked,
  isFinalized,
  hasRecovered,
}: GetRevenueShareStatusForMemberProps) => {
  if (currentBlock < startingAt) {
    return 'upcoming'
  }

  if (currentBlock > endingAt) {
    if (hasMemberStaked && !hasRecovered) {
      return 'unlock'
    }

    if (isFinalized) {
      return 'finalized'
    }

    return 'past'
  }

  if (hasMemberStaked) {
    return 'locked'
  }

  return 'active'
}

export const calculateSlopeNumberForAmm = (totalSupply: number, holdersRevenueShare: number, tokenPrice: number) => {
  const divisor = new BN(Math.max(1000, totalSupply / 3))
    .muln(2)
    .addn(totalSupply)
    .pow(new BN(2))
    .sub(new BN(totalSupply).pow(new BN(2)))
  const dividend = new BN(10_000).muln((holdersRevenueShare / 100) * 4)
  const slopeByUSD = dividend.toNumber() / divisor.toNumber()
  return slopeByUSD / tokenPrice
}
