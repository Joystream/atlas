import { useGetChannelNftsQuery, useGetNftQuery } from '@/api/queries'

export const useNft = (videoId: string) => {
  const { data, ...rest } = useGetNftQuery({ variables: { videoId: videoId }, skip: !videoId })

  return {
    nft: data?.ownedNfts[0],
    ...rest,
  }
}

export const useChannelNfts = (channelId: string) => {
  const { data, ...rest } = useGetChannelNftsQuery({
    variables: {
      where: {
        channel: { id_eq: channelId },
        nft: { metadata_contains: '' },
        isPublic_eq: true,
        isCensored_eq: false,
        thumbnailPhoto: {
          isAccepted_eq: true,
        },
        media: {
          isAccepted_eq: true,
        },
      },
    },
  })
  console.log(data)
  return {
    nfts: data?.videosConnection.edges.map((video) => video.node.nft),
    totalCount: data?.videosConnection.totalCount,
    ...rest,
  }
}
