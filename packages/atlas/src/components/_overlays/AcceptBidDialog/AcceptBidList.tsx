import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { RadioInput } from '@/components/_inputs/RadioInput'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useMemberAvatar } from '@/providers/assets'
import { cVar, transitions } from '@/styles'
import { formatDateTime } from '@/utils/time'

import { Bid } from './AcceptBidDialog.types'
import { BidRowWrapper, Price, TokenPrice } from './AcceptBidList.styles'

type BidRowProps = {
  selectedValue?: string
  onSelect?: (selectedBid: string) => void
  size?: 'medium' | 'small'
} & Bid

type AcceptBidListProps = {
  items: BidRowProps[]
  onSelect?: (selectedBid: string) => void
  selectedBidder?: string
}

export const AcceptBidList: React.FC<AcceptBidListProps> = ({ items, onSelect, selectedBidder }) => {
  return (
    <>
      {items.map((item) => (
        <BidRow
          key={`bidRow-${item.id}`}
          {...item}
          selectedValue={selectedBidder || ''}
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
  bidder,
  createdAt,
  amount,
  amountUSD,
  selectedValue,
  onSelect,
}) => {
  const xsMatch = useMediaMatch('xs')
  const selected = selectedValue === id
  const { url, isLoadingAsset } = useMemberAvatar(bidder)
  return (
    <BidRowWrapper selected={selected} onClick={() => onSelect?.(bidder.id)}>
      <RadioInput selectedValue={selectedValue} value={id} />
      {xsMatch && <Avatar assetUrl={url} loading={isLoadingAsset} size="small" />}
      <div>
        <Text variant="h300" secondary={!selected} margin={{ bottom: 1 }}>
          {bidder?.handle}
        </Text>
        <Text as="p" secondary variant="t100">
          {formatDateTime(createdAt)}
        </Text>
      </div>
      <Price>
        <TokenPrice>
          <JoyTokenIcon variant={selected ? 'regular' : 'gray'} />
          <Text variant="h300" margin={{ left: 1 }} secondary={!selected}>
            {amount}
          </Text>
        </TokenPrice>
        <SwitchTransition>
          <CSSTransition
            key={amountUSD ? 'placeholder' : 'content'}
            timeout={parseInt(cVar('animationTransitionFast', true))}
            classNames={transitions.names.fade}
          >
            <Text as="p" variant="t100" secondary>
              {amountUSD ?? '‌'}
            </Text>
          </CSSTransition>
        </SwitchTransition>
      </Price>
    </BidRowWrapper>
  )
}
