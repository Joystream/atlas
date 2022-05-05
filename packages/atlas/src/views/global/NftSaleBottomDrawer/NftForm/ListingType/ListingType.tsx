import React from 'react'

import { Text } from '@/components/Text'
import { SvgActionAuction, SvgActionBuyNow } from '@/components/_icons'

import { Header, OptionsWrapper, StyledOptionCardRadio } from './ListingTypes.styles'

import { Listing } from '../NftForm.types'

type ListingTypeProps = {
  selectedType?: string
  onSelectType: (type: Listing) => void
}

export const ListingType: React.FC<ListingTypeProps> = ({ selectedType, onSelectType }) => {
  return (
    <>
      <Header variant="h500">Choose listing type</Header>
      <Text variant="t300" secondary>
        Choose the listing type for your NFT
      </Text>
      <OptionsWrapper>
        <StyledOptionCardRadio
          onChange={() => onSelectType('Auction')}
          selectedValue={selectedType}
          value="Auction"
          label="Auction"
          icon={<SvgActionAuction />}
          helperText="Put it on a timed or open auction. See the bids coming."
        />
        <StyledOptionCardRadio
          onChange={() => onSelectType('Fixed price')}
          selectedValue={selectedType}
          value="Fixed price"
          label="Fixed price"
          icon={<SvgActionBuyNow />}
          helperText="Sell it for a fixed price only. No bids."
        />
      </OptionsWrapper>
    </>
  )
}
