import React from 'react'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { RadioInput } from '@/components/_inputs/RadioInput'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { formatDateTime } from '@/utils/time'

import { BidRowWrapper, Price, TokenPrice } from './AcceptBidList.styles'

type BidRowProps = {
  id: string
  memberHandle: string
  date: Date
  bid: number
  bidUSD: string
  memberAvatarUri: string
  selectedValue?: string
  onSelect?: (selectedBid: string) => void
  size?: 'medium' | 'small'
}

type AcceptBidListProps = {
  items: BidRowProps[]
  onSelect?: (selectedBid: string) => void
  selectedBid?: string
}

export const AcceptBidList: React.FC<AcceptBidListProps> = ({ items, onSelect, selectedBid }) => {
  return (
    <>
      {items.map((item) => (
        <BidRow
          key={`bidRow-${item.id}`}
          {...item}
          selectedValue={selectedBid || ''}
          onSelect={(value) => {
            onSelect?.(value)
          }}
        />
      ))}
    </>
  )
}

export const BidRow: React.FC<BidRowProps> = ({
  id,
  memberHandle,
  date,
  bid,
  bidUSD,
  memberAvatarUri,
  selectedValue,
  onSelect,
}) => {
  const xsMatch = useMediaMatch('xs')
  const selected = selectedValue === id
  return (
    <BidRowWrapper selected={selected} onClick={() => onSelect?.(id)}>
      <RadioInput selectedValue={selectedValue} value={id} />
      {xsMatch && <Avatar assetUrl={memberAvatarUri} size="small" />}
      <div>
        <Text variant="h300" secondary={!selected} margin={{ bottom: 1 }}>
          {memberHandle}
        </Text>
        <Text as="p" secondary variant="t100">
          {formatDateTime(date)}
        </Text>
      </div>
      <Price>
        <TokenPrice>
          <JoyTokenIcon variant={selected ? 'regular' : 'gray'} />
          <Text variant="h300" margin={{ left: 1 }} secondary={!selected}>
            {bid}
          </Text>
        </TokenPrice>
        <Text as="p" variant="t100" secondary>
          {bidUSD}
        </Text>
      </Price>
    </BidRowWrapper>
  )
}
