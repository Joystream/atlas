import { GraphQLClient } from 'graphql-request'

import { getSdk } from './__generated__/sdk'

export class OrionClient {
  private sdk: ReturnType<typeof getSdk>

  constructor(graphqlUrl: string) {
    const client = new GraphQLClient(graphqlUrl)
    this.sdk = getSdk(client)
  }

  async testConnection() {
    const { videos } = await this.sdk.TestQuery()
    if (!videos) {
      throw new Error('Could not connect to Orion')
    }
  }

  async getVideo(id: string) {
    const { videoByUniqueInput } = await this.sdk.GetVideo({ id })
    return videoByUniqueInput
  }

  async getChannel(id: string) {
    const { channelByUniqueInput } = await this.sdk.GetChannel({ id })
    return channelByUniqueInput
  }
}
