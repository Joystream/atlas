import BN from 'bn.js'
import { FC } from 'react'

import { Avatar } from '@/components/Avatar'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { RadioInput } from '@/components/_inputs/RadioInput'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { formatDateTime } from '@/utils/time'

import { Bid, SelectedBid } from './AcceptBidDialog.types'
import { BidRowWrapper, Price } from './AcceptBidList.styles'

type BidRowProps = {
  selectedBid?: SelectedBid
  onSelect?: (bidderId: string, price: BN) => void
  size?: 'medium' | 'small'
} & Bid

type AcceptBidListProps = {
  items: BidRowProps[]
  onSelect?: ({ bidderId, amount }: SelectedBid) => void
  selectedBid?: SelectedBid
}

export const AcceptBidList: FC<AcceptBidListProps> = ({ items, onSelect, selectedBid }) => {
  return (
    <>
      {items.map((item) => (
        <BidRow
          key={`bidRow-${item.bidder.id}-${item.amount}`}
          {...item}
          selectedBid={selectedBid}
          onSelect={(id, amount) => {
            onSelect?.({ bidderId: id, amount })
          }}
        />
      ))}
    </>
  )
}

export const BidRow: FC<BidRowProps> = ({ bidder, createdAt, amount, selectedBid, onSelect }) => {
  const xsMatch = useMediaMatch('xs')
  const selected = selectedBid?.bidderId === bidder.id
  const { urls, isLoadingAsset } = getMemberAvatar(bidder)
  return (
    <BidRowWrapper selected={selected} onClick={() => onSelect?.(bidder.id, amount)}>
      <RadioInput
        selectedValue={selectedBid?.bidderId}
        value={bidder.id}
        onChange={() => onSelect?.(bidder.id, amount)}
      />
      {xsMatch && <Avatar assetUrls={urls} loading={isLoadingAsset} size={40} />}
      <div>
        <Text as="p" variant="h300" color={!selected ? 'colorText' : undefined} margin={{ bottom: 1 }}>
          {bidder?.handle}
        </Text>
        <Text as="p" color="colorText" variant="t100">
          {formatDateTime(new Date(createdAt))}
        </Text>
      </div>
      <Price>
        <NumberFormat
          value={amount}
          icon={<JoyTokenIcon variant={selected ? 'regular' : 'gray'} />}
          format="short"
          as="p"
          variant="h300"
          color={!selected ? 'colorText' : undefined}
          withDenomination
          denominationAlign="right"
        />
      </Price>
    </BidRowWrapper>
  )
}
