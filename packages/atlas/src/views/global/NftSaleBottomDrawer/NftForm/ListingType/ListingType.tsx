import { FC } from 'react'

import { Text } from '@/components/Text'
import { SvgActionAuction, SvgActionBuyNow } from '@/components/_icons'
import { OptionCardGroupRadio } from '@/components/_inputs/OptionCardGroup'

import { OptionsWrapper } from './ListingTypes.styles'

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
        Choose how you want to sale your NFT.
      </Text>
      <OptionsWrapper>
        <OptionCardGroupRadio
          selectedValue={selectedType}
          onChange={(value) => onSelectType(value as Listing)}
          direction="vertical"
          options={[
            {
              label: 'Auction',
              caption: 'Put it on a timed or open auction. See the bids coming.',
              value: 'Auction',
              icon: <SvgActionAuction />,
            },
            {
              label: 'Fixed price',
              caption: 'Sell it for a fixed price only. No bids.',
              value: 'Fixed price',
              icon: <SvgActionBuyNow />,
            },
          ]}
        />
      </OptionsWrapper>
    </>
  )
}
