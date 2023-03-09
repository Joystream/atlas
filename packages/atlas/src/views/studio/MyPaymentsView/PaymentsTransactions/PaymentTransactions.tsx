import { useMemo } from 'react'

import { useFullChannel } from '@/api/hooks/channel'
import { SvgJoyTokenMonochrome24 } from '@/assets/icons'
import { TablePaymentsHistory } from '@/components/TablePaymentsHistory'
import { WidgetTile } from '@/components/WidgetTile'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useUser } from '@/providers/user/user.hooks'
import { formatNumber } from '@/utils/number'
import { useChannelPaymentsHistory } from '@/views/studio/MyPaymentsView/PaymentsTransactions/PaymentTransactions.hooks'
import { aggregatePaymentHistory } from '@/views/studio/MyPaymentsView/PaymentsTransactions/PaymentTransactions.utils'

import { TableWrapper, TilesWrapper } from './PaymentTransactions.styles'

export const PaymentTransactions = () => {
  const { channelId } = useUser()
  const { channel } = useFullChannel(channelId ?? '')

  const { paymentData, loading } = useChannelPaymentsHistory(channel)
  const paymentHistoryOverview = useMemo(() => aggregatePaymentHistory(paymentData), [paymentData])

  return (
    <>
      <TilesWrapper>
        <WidgetTile
          title="Total earned"
          text={formatNumber(hapiBnToTokenNumber(paymentHistoryOverview.totalEarned))}
          loading={loading}
          icon={<SvgJoyTokenMonochrome24 />}
        />
        <WidgetTile
          title="Total withdrawn"
          loading={loading}
          text={formatNumber(hapiBnToTokenNumber(paymentHistoryOverview.totalWithdrawn))}
          icon={<SvgJoyTokenMonochrome24 />}
        />
      </TilesWrapper>
      <TableWrapper isEmpty={!paymentData.length}>
        <TablePaymentsHistory isLoading={loading} data={paymentData} />
      </TableWrapper>
    </>
  )
}
