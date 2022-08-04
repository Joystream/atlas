import BN from 'bn.js'
import { FC } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Avatar } from '@/components/Avatar'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { RadioInput } from '@/components/_inputs/RadioInput'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useMemberAvatar } from '@/providers/assets'
import { cVar, transitions } from '@/styles'
import { formatDateTime } from '@/utils/time'

import { Bid, SelectedBid } from './AcceptBidDialog.types'
import { BidRowWrapper, Price, TokenPrice } from './AcceptBidList.styles'

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

export const BidRow: FC<BidRowProps> = ({ bidder, createdAt, amount, amountUSD, selectedBid, onSelect }) => {
  const xsMatch = useMediaMatch('xs')
  const selected = selectedBid?.bidderId === bidder.id
  const { url, isLoadingAsset } = useMemberAvatar(bidder)
  return (
    <BidRowWrapper selected={selected} onClick={() => onSelect?.(bidder.id, amount)}>
      <RadioInput
        selectedValue={selectedBid?.bidderId}
        value={bidder.id}
        onChange={() => onSelect?.(bidder.id, amount)}
      />
      {xsMatch && <Avatar assetUrl={url} loading={isLoadingAsset} size="small" />}
      <div>
        <Text as="p" variant="h300" color={!selected ? 'colorText' : undefined} margin={{ bottom: 1 }}>
          {bidder?.handle}
        </Text>
        <Text as="p" color="colorText" variant="t100">
          {formatDateTime(new Date(createdAt))}
        </Text>
      </div>
      <Price>
        <TokenPrice>
          <JoyTokenIcon variant={selected ? 'regular' : 'gray'} />
          <Text as="p" variant="h300" margin={{ left: 1 }} color={!selected ? 'colorText' : undefined}>
            {hapiBnToTokenNumber(amount)}
          </Text>
        </TokenPrice>
        <CSSTransition
          in={!!amountUSD}
          timeout={parseInt(cVar('animationTransitionFast', true))}
          classNames={transitions.names.fade}
        >
          <NumberFormat value={amountUSD || 0} format="dollar" as="p" variant="t100" color="colorText" />
        </CSSTransition>
      </Price>
    </BidRowWrapper>
  )
}
