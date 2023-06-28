import { useMemo } from 'react'

import { NumberFormat } from '@/components/NumberFormat'
import { TablePaymentsHistory } from '@/components/TablePaymentsHistory'
import { WidgetTile } from '@/components/WidgetTile'
import { useUser } from '@/providers/user/user.hooks'
import { useChannelPaymentsHistory } from '@/views/studio/MyPaymentsView/PaymentsTransactions/PaymentTransactions.hooks'
import { aggregatePaymentHistory } from '@/views/studio/MyPaymentsView/PaymentsTransactions/PaymentTransactions.utils'

import { StyledSvgJoyTokenMonochrome24, TableWrapper, TilesWrapper } from './PaymentTransactions.styles'

export const PaymentTransactions = () => {
  const { channelId } = useUser()

  const { paymentData, loading } = useChannelPaymentsHistory(channelId || '')
  const paymentHistoryOverview = useMemo(() => aggregatePaymentHistory(paymentData || []), [paymentData])

  return (
    <>
      <TilesWrapper>
        <WidgetTile
          title="Total earned"
          customNode={
            <NumberFormat
              value={paymentHistoryOverview.totalEarned}
              as="span"
              icon={<StyledSvgJoyTokenMonochrome24 />}
              withDenomination
            />
          }
          loading={loading}
        />
        <WidgetTile
          title="Total withdrawn"
          loading={loading}
          customNode={
            <NumberFormat
              value={paymentHistoryOverview.totalWithdrawn.abs()}
              as="span"
              icon={<StyledSvgJoyTokenMonochrome24 />}
              withDenomination
            />
          }
        />
      </TilesWrapper>
      <TableWrapper isEmpty={!paymentData?.length}>
        <TablePaymentsHistory isLoading={loading} data={paymentData ?? []} />
      </TableWrapper>
    </>
  )
}
