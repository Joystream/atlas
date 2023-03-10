import {
  GetExtendedFullChannelsQuery,
  useGetChannelPaymentEventsQuery,
} from '@/api/queries/__generated__/channels.generated'

import { mapEventToPaymentHistory } from './PaymentTransactions.utils'

export const useChannelPaymentsHistory = (
  channel?: GetExtendedFullChannelsQuery['extendedChannels'][number]['channel']
) => {
  const { data, refetch, ...rest } = useGetChannelPaymentEventsQuery({
    variables: {
      channelId: channel?.id ?? '-1',
      ownerMemberId: channel?.ownerMember?.id ?? '-1',
    },
    skip: !channel,
  })

  return {
    ...rest,
    rawData: data,
    paymentData: data?.events.map(mapEventToPaymentHistory),
    loading: rest.loading,
    fetchPaymentsData: refetch,
  }
}
