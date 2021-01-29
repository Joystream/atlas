import { useGetChannelQuery, GetChannelQuery } from '@/api/queries/__generated__/channels.generated'
import { QueryHookOptions } from '@apollo/client'

type Opts = QueryHookOptions<GetChannelQuery>
const useChannel = (id: string, opts?: Opts) => {
  const { data, ...rest } = useGetChannelQuery({
    ...opts,
    variables: { id },
  })
  return {
    channel: data?.channel,
    ...rest,
  }
}

export default useChannel
