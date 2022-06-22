import { FC } from 'react'

import { Text } from '@/components/Text'
import { SvgActionAuction, SvgActionBuyNow } from '@/components/_icons'

import { OptionsWrapper, StyledOptionCardRadio } from './ListingTypes.styles'

import { Listing } from '../NftForm.types'

type ListingTypeProps = {
  selectedType?: string
  onSelectType: (type: Listing) => void
}

export const ListingType: FC<ListingTypeProps> = ({ selectedType, onSelectType }) => {
  return (
    <>
      <Text as="h1" variant="h500" margin={{ bottom: 4 }}>
        Choose listing type
      </Text>
      <Text as="p" variant="t300" color="colorText">
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
