import BN from 'bn.js'
import { FC, useMemo } from 'react'

import { SvgActionBuyNow } from '@/assets/icons'
import { Table, TableProps } from '@/components/Table'
import { Text } from '@/components/Text'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useTokenPrice } from '@/providers/joystream/joystream.hooks'
import { formatNumber } from '@/utils/number'
import { formatDateTime } from '@/utils/time'

import {
  JoyAmountWrapper,
  StyledJoyTokenIcon,
  StyledNumberFormat,
  TypeIconWrapper,
  TypeWrapper,
} from './TablePaymentsHistory.styles'

const COLUMNS: TableProps['columns'] = [
  {
    Header: 'Date',
    accessor: 'date',
  },
  {
    Header: 'Type',
    accessor: 'type',
  },
  {
    Header: 'Amount',
    accessor: 'amount',
  },
  {
    Header: 'Channel balance',
    accessor: 'channelBalance',
  },
]

type PaymentType = 'nft-sale' | 'nft-royalty' | 'claimed-reward' | 'withdrawal' | 'ypp-reward'

export interface PaymentHistory {
  type: PaymentType
  block: number
  date: Date
  channelBalance: BN
  amount: BN
}

export type TablePaymentsHistoryProps = {
  data: PaymentHistory[]
}

export const TablePaymentsHistory: FC<TablePaymentsHistoryProps> = ({ data }) => {
  const mappedData: TableProps['data'] = useMemo(
    () =>
      data.map((data) => ({
        date: <Date date={data.date} />,
        type: <Type type={data.type} />,
        amount: <TokenAmount tokenAmount={data.amount} />,
        channelBalance: <TokenAmount tokenAmount={data.channelBalance} />,
      })),
    [data]
  )
  return <Table title="History" columns={COLUMNS} data={mappedData} minWidth="750px" />
}

const Date = ({ date }: { date: Date }) => {
  const { convertMsTimestampToBlock } = useBlockTimeEstimation()
  return (
    <>
      <Text as="p" variant="t200-strong">
        {formatDateTime(date)}
      </Text>
      <Text as="p" variant="t100" margin={{ top: 1 }} color="colorText">
        {formatNumber(convertMsTimestampToBlock(date.getTime()) || 0)} blocks
      </Text>
    </>
  )
}

const Type = ({ type }: { type: PaymentType }) => {
  const translatedPaymentType = {
    'nft-sale': 'NFT sale',
    'nft-royalty': 'NFT royalty',
    'claimed-reward': 'Claimed reward',
    'withdrawal': 'Withdrawal',
    'ypp-reward': 'YPP reward',
  }
  return (
    <TypeWrapper>
      <TypeIconWrapper>
        <SvgActionBuyNow />
      </TypeIconWrapper>
      <Text variant="t200" as="p" margin={{ left: 2 }}>
        {translatedPaymentType[type]}
      </Text>
    </TypeWrapper>
  )
}

const TokenAmount = ({ tokenAmount }: { tokenAmount: BN }) => {
  const { convertHapiToUSD } = useTokenPrice()
  const isNegative = tokenAmount.isNeg()
  return (
    <>
      <JoyAmountWrapper>
        <StyledJoyTokenIcon variant="gray" error={isNegative} />
        <StyledNumberFormat
          variant="t200-strong"
          as="p"
          value={tokenAmount}
          margin={{ left: 1 }}
          color={isNegative ? 'colorTextError' : 'colorTextStrong'}
        />
      </JoyAmountWrapper>
      <StyledNumberFormat
        variant="t100"
        as="p"
        format="dollar"
        value={convertHapiToUSD(tokenAmount) ?? 0}
        color={isNegative ? 'colorTextError' : 'colorText'}
        margin={{ top: 1 }}
      />
    </>
  )
}
