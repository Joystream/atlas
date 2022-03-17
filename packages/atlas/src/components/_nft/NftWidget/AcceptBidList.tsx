import { format } from 'date-fns'
import React from 'react'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { RadioInput } from '@/components/_inputs/RadioInput'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { BidRowWrapper, Price, TokenPrice } from './AcceptBidList.styles'

type BidRowProps = {
  id: string
  memberHandle: string
  date: Date
  bid: number
  bidUSD: string
  memberAvatarUri: string
  selectedValue?: string
  handleSelect?: (selectedBid: string) => void
  size?: 'medium' | 'small'
}

type AcceptBidListProps = {
  items: BidRowProps[]
  handleSelect?: (selectedBid: string) => void
  selectedBid?: string
}

export const AcceptBidList: React.FC<AcceptBidListProps> = ({ items, handleSelect, selectedBid }) => {
  return (
    <>
      {items.map((item) => (
        <BidRow
          key={`bidRow-${item.id}`}
          {...item}
          selectedValue={selectedBid || ''}
          handleSelect={(value) => {
            handleSelect?.(value)
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
  handleSelect,
}) => {
  const xsMatch = useMediaMatch('xs')
  const selected = selectedValue === id
  return (
    <BidRowWrapper selected={selected}>
      <RadioInput onChange={() => handleSelect?.(id)} selectedValue={selectedValue} value={id} />
      {xsMatch && <Avatar assetUrl={memberAvatarUri} size="small" />}
      <div>
        <Text variant="h300" margin={{ bottom: 1 }} secondary={!selected}>
          {memberHandle}
        </Text>
        <Text secondary variant="t100">
          {format(date, "LLL dd yyy 'at' HH:mm")}
        </Text>
      </div>
      <Price>
        <TokenPrice>
          <JoyTokenIcon variant={selected ? 'regular' : 'gray'} />
          <Text variant="h300" margin={{ left: 1 }} secondary={!selected}>
            {bid}
          </Text>
        </TokenPrice>
        <Text variant="t100" secondary>
          {bidUSD}
        </Text>
      </Price>
    </BidRowWrapper>
  )
}
