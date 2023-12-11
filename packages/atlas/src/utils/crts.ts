import BN from 'bn.js'

export const calcBuyMarketPricePerToken = (
  mintedByAmm?: string,
  ammSlopeParameter?: string,
  ammInitPrice?: string,
  amount = 1
) => {
  if (!mintedByAmm || !ammSlopeParameter || !ammInitPrice) return

  const totalSupply = new BN(mintedByAmm)
  const allocation = totalSupply
    .addn(amount)
    .pow(new BN(2))
    .sub(totalSupply.pow(new BN(2)))
  return new BN(ammSlopeParameter).muln(0.5).mul(allocation).add(new BN(ammInitPrice).muln(amount))
}

export const calcSellMarketPricePerToken = (
  mintedByAmm?: string,
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
  return new BN(ammSlopeParameter).muln(0.5).mul(allocation).add(new BN(ammInitPrice).muln(amount))
}

type GetRevenueShareStatusForMemberProps = {
  currentBlock: number
  startingAt: number
  endingAt: number
  hasMemberStaked: boolean
  isFinalized: boolean
}

export const getRevenueShareStatusForMember = ({
  currentBlock,
  startingAt,
  endingAt,
  hasMemberStaked,
  isFinalized,
}: GetRevenueShareStatusForMemberProps) => {
  if (currentBlock < startingAt) {
    return 'upcoming'
  }

  if (currentBlock > endingAt) {
    if (isFinalized) {
      return 'finalized'
    }
    if (hasMemberStaked) {
      return 'unlock'
    }

    return 'past'
  }

  if (hasMemberStaked) {
    return 'locked'
  }

  return 'active'
}
