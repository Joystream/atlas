import { useQuery } from '@apollo/client'
import { GET_CHANNEL } from '@/api/queries/channels'
import { GetChannel, GetChannelVariables } from '@/api/queries/__generated__/GetChannel'

export const useChannel = (id: string) => {
  const { data, loading, error } = useQuery<GetChannel, GetChannelVariables>(GET_CHANNEL, {
    variables: { id },
  })
  return {
    loading,
    data: data?.channel,
    error,
  }
}

export const useChannelLink = (id: string | undefined) => {
  const { data } = useQuery<GetChannel, GetChannelVariables>(GET_CHANNEL, {
    fetchPolicy: 'cache-first',
    skip: !id,
    variables: {
      id: id || '',
    },
  })
  return {
    data: data?.channel,
  }
}
