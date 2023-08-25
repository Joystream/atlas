import { GraphQLClient } from 'graphql-request'

import { getSdk } from './__generated__/sdk'

export class OrionClient {
  private sdk: ReturnType<typeof getSdk>

  constructor(graphqlUrl: string, sessionCookie: string) {
    const client = new GraphQLClient(graphqlUrl, { headers: { Cookie: sessionCookie } })
    this.sdk = getSdk(client)
  }

  async testConnection() {
    const { videos } = await this.sdk.TestQuery()
    if (!videos) {
      throw new Error('Could not connect to Orion')
    }
  }

  async getVideo(id: string) {
    const { videoById } = await this.sdk.GetVideo({ id })
    return videoById
  }

  async getChannel(id: string) {
    const { channelById } = await this.sdk.GetChannel({ id })
    return channelById
  }
}
