import { useGetChannelPaymentEventsQuery } from '@/api/queries/__generated__/channels.generated'
import { useJoystream } from '@/providers/joystream/joystream.hooks'

import { mapEventToPaymentHistory } from './PaymentTransactions.utils'

export const useChannelPaymentsHistory = (channelId: string) => {
  const {
    chainState: { nftPlatformFeePercentage },
  } = useJoystream()
  const { data, refetch, ...rest } = useGetChannelPaymentEventsQuery({
    variables: {
      channelId: channelId ?? '-1',
    },
    skip: !channelId,
  })

  return {
    ...rest,
    rawData: data,
    paymentData: data?.events.map(mapEventToPaymentHistory(nftPlatformFeePercentage)),
    loading: rest.loading,
    fetchPaymentsData: refetch,
  }
}
