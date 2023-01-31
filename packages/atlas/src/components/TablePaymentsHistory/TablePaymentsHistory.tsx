import BN from 'bn.js'
import { FC, ReactElement, useMemo } from 'react'

import { SvgActionBuyNow } from '@/assets/icons'
import { Table, TableProps } from '@/components/Table'
import { Text } from '@/components/Text'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
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
    Header: 'Sender',
    accessor: 'sender',
  },
  {
    Header: 'Amount',
    accessor: 'amount',
  },
  {
    Header: 'Description',
    accessor: 'description',
  },
]

const paymentTypeMappings: Record<
  PaymentType,
  {
    title: string
    icon?: ReactElement
  }
> = {
  'nft-sale': {
    title: 'NFT sale',
  },
  'nft-royalty': {
    title: 'NFT royalty',
  },
  'claimed-reward': {
    title: 'Claimed reward',
  },
  'withdrawal': {
    title: 'Withdrawal',
  },
  'ypp-reward': {
    title: 'YPP reward',
  },
}

type PaymentType = 'nft-sale' | 'nft-royalty' | 'claimed-reward' | 'withdrawal' | 'ypp-reward'

export type PaymentHistory = {
  type: PaymentType
  block: number
  date: Date
  sender: string
  description: string
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
        description: (
          <Text variant="t200" as="p">
            {data.description}
          </Text>
        ),
      })),
    [data]
  )
  return <Table title="History" columns={COLUMNS} data={mappedData} />
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
  return (
    <TypeWrapper>
      <TypeIconWrapper>
        <SvgActionBuyNow />
      </TypeIconWrapper>
      <Text variant="t200" as="p" margin={{ left: 2 }}>
        {paymentTypeMappings[type].title}
      </Text>
    </TypeWrapper>
  )
}

const TokenAmount = ({ tokenAmount }: { tokenAmount: BN }) => {
  const isNegative = tokenAmount.isNeg()
  return (
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
  )
}
