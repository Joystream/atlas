import { GraphQLClient } from 'graphql-request'

import { getSdk } from './__generated__/sdk'

import { GRAPHQL_URL } from '../config'

const client = new GraphQLClient(GRAPHQL_URL)
const sdk = getSdk(client)

export const getVideo = async (id: string) => {
  const { videoByUniqueInput } = await sdk.GetVideo({ id })
  return videoByUniqueInput
}

export const getChannel = async (id: string) => {
  const { channelByUniqueInput } = await sdk.GetChannel({ id })
  return channelByUniqueInput
}
