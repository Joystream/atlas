import React from 'react'

import { Text } from '@/components/Text'
import { SvgActionAuction, SvgActionBuyNow, SvgActionLock } from '@/components/_icons'
import { Listing } from '@/views/studio/VideoWorkspace/NftForm/types'

import { Header, OptionsWrapper, StyledOptionCardRadio } from './ListingTypes.styles'

type ListingTypeProps = {
  selectedType?: string
  onSelectType: (type: Listing) => void
}

export const ListingType: React.FC<ListingTypeProps> = ({ selectedType, onSelectType }) => {
  return (
    <>
      <Header variant="h500">Choose listing type</Header>
      <Text variant="t300" secondary>
        Choose “Not for sale” if you don’t want to sell your NFT right away or “Put on marketplace” to sell it on
        auction, or for a fixed price.
      </Text>
      <OptionsWrapper>
        <StyledOptionCardRadio
          onChange={() => onSelectType('Auction')}
          selectedValue={selectedType}
          value="Auction"
          label="Auction"
          icon={<SvgActionAuction />}
          helperText="Sell it on auction or for fixed price. Optionally choose time, whitelist, royalties."
        />
        <StyledOptionCardRadio
          onChange={() => onSelectType('Fixed price')}
          selectedValue={selectedType}
          value="Fixed price"
          label="Fixed price"
          icon={<SvgActionBuyNow />}
          helperText="Sell it for a fixed price only. No bids accepted."
        />
        <StyledOptionCardRadio
          onChange={() => onSelectType('Not for sale')}
          selectedValue={selectedType}
          value="Not for sale"
          label="Not for sale"
          icon={<SvgActionLock />}
          helperText="Suitable for holding NFT without receiving offers for it. Can be changed later."
        />
      </OptionsWrapper>
    </>
  )
}
