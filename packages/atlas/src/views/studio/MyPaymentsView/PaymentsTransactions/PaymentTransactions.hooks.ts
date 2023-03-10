import { useGetChannelPaymentEventsQuery } from '@/api/queries/__generated__/channels.generated'

import { mapEventToPaymentHistory } from './PaymentTransactions.utils'

export const useChannelPaymentsHistory = (channelId: string) => {
  const { data, refetch, ...rest } = useGetChannelPaymentEventsQuery({
    variables: {
      channelId: channelId ?? '-1',
    },
    skip: !channelId,
  })

  return {
    ...rest,
    rawData: data,
    paymentData: data?.events.map(mapEventToPaymentHistory),
    loading: rest.loading,
    fetchPaymentsData: refetch,
  }
}
