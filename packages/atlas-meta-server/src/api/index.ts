import { GraphQLClient } from 'graphql-request'

import { getSdk } from './__generated__/sdk'

const { GRAPHQL_URL } = process.env
if (!GRAPHQL_URL) {
  // eslint-disable-next-line no-console
  console.error('Missing required GRAPHQL_URL env variable')
  process.exit(1)
}

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
