import { useMemo } from 'react'

import { useFullChannel } from '@/api/hooks/channel'
import { SvgJoyTokenMonochrome24 } from '@/assets/icons'
import { TablePaymentsHistory } from '@/components/TablePaymentsHistory'
import { StyledNumberFormat } from '@/components/TablePaymentsHistory/TablePaymentsHistory.styles'
import { WidgetTile } from '@/components/WidgetTile'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useTokenPrice } from '@/providers/joystream/joystream.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { formatNumber } from '@/utils/number'
import { useChannelPaymentsHistory } from '@/views/studio/MyPaymentsView/PaymentsTransactionTab/PaymentTransactionsTab.hooks'
import { aggregatePaymentHistory } from '@/views/studio/MyPaymentsView/PaymentsTransactionTab/utils'

import { TilesWrapper } from './PaymentTransactionsTab.styles'

export const PaymentTransactionsTab = () => {
  const { convertHapiToUSD } = useTokenPrice()
  const { channelId } = useUser()
  const { channel } = useFullChannel(channelId ?? '')

  const { paymentData, loading } = useChannelPaymentsHistory(channel)
  const paymentHistoryOverview = useMemo(() => aggregatePaymentHistory(paymentData), [paymentData.length])

  return (
    <>
      <TilesWrapper>
        <WidgetTile
          title="Total earned"
          text={formatNumber(hapiBnToTokenNumber(paymentHistoryOverview.totalEarned))}
          loading={loading}
          caption={
            <StyledNumberFormat
              variant="t100"
              as="p"
              format="dollar"
              value={convertHapiToUSD(paymentHistoryOverview.totalEarned) ?? 0}
              margin={{ top: 1 }}
            />
          }
          icon={<SvgJoyTokenMonochrome24 />}
        />
        <WidgetTile
          title="Total withdrawn"
          loading={loading}
          text={formatNumber(hapiBnToTokenNumber(paymentHistoryOverview.totalWithdrawn))}
          caption={
            <StyledNumberFormat
              variant="t100"
              as="p"
              format="dollar"
              value={convertHapiToUSD(paymentHistoryOverview.totalWithdrawn) ?? 0}
              margin={{ top: 1 }}
            />
          }
          icon={<SvgJoyTokenMonochrome24 />}
        />
      </TilesWrapper>
      <TablePaymentsHistory data={paymentData} />
    </>
  )
}
