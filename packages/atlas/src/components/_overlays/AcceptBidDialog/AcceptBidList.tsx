import { FC } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Avatar } from '@/components/Avatar'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { RadioInput } from '@/components/_inputs/RadioInput'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useMemberAvatar } from '@/providers/assets'
import { cVar, transitions } from '@/styles'
import { formatDateTime } from '@/utils/time'

import { Bid } from './AcceptBidDialog.types'
import { BidRowWrapper, Price, TokenPrice } from './AcceptBidList.styles'

type SelectedBidder = {
  id: string
  amount: string
}

type BidRowProps = {
  selectedValue?: SelectedBidder
  onSelect?: (selectedBid: string, price: string) => void
  size?: 'medium' | 'small'
} & Bid

type AcceptBidListProps = {
  items: BidRowProps[]
  onSelect?: ({ id, amount }: SelectedBidder) => void
  selectedBidder?: SelectedBidder
}

export const AcceptBidList: FC<AcceptBidListProps> = ({ items, onSelect, selectedBidder }) => {
  return (
    <>
      {items.map((item) => (
        <BidRow
          key={`bidRow-${item.bidder.id}-${item.amount}`}
          {...item}
          selectedValue={selectedBidder}
          onSelect={(id, amount) => {
            onSelect?.({ id, amount })
          }}
        />
      ))}
    </>
  )
}

export const BidRow: FC<BidRowProps> = ({ bidder, createdAt, amount, amountUSD, selectedValue, onSelect }) => {
  const xsMatch = useMediaMatch('xs')
  const selected = selectedValue?.id === bidder.id
  const { url, isLoadingAsset } = useMemberAvatar(bidder)
  return (
    <BidRowWrapper selected={selected} onClick={() => onSelect?.(bidder.id, amount)}>
      <RadioInput selectedValue={selectedValue?.id} value={bidder.id} onChange={() => onSelect?.(bidder.id, amount)} />
      {xsMatch && <Avatar assetUrl={url} loading={isLoadingAsset} size="small" />}
      <div>
        <Text variant="h300" color={!selected ? 'default' : undefined} margin={{ bottom: 1 }}>
          {bidder?.handle}
        </Text>
        <Text as="p" color="default" variant="t100">
          {formatDateTime(new Date(createdAt))}
        </Text>
      </div>
      <Price>
        <TokenPrice>
          <JoyTokenIcon variant={selected ? 'regular' : 'gray'} />
          <Text variant="h300" margin={{ left: 1 }} color={!selected ? 'default' : undefined}>
            {amount}
          </Text>
        </TokenPrice>
        <SwitchTransition>
          <CSSTransition
            key={amountUSD ? 'placeholder' : 'content'}
            timeout={parseInt(cVar('animationTransitionFast', true))}
            classNames={transitions.names.fade}
          >
            {amountUSD ? <NumberFormat value={amountUSD} format="dollar" as="p" variant="t100" color="default" /> : '‌'}
          </CSSTransition>
        </SwitchTransition>
      </Price>
    </BidRowWrapper>
  )
}
