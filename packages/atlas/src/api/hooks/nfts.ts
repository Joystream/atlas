import { useGetChannelNftsQuery, useGetNftQuery } from '@/api/queries'

export const useNft = (videoId: string) => {
  const { data, ...rest } = useGetNftQuery({ variables: { videoId: videoId }, skip: !videoId })

  return {
    nft: data?.ownedNfts[0],
    ...rest,
  }
}

export const useChannelNfts = (channelId: string) => {
  const { data, ...rest } = useGetChannelNftsQuery({ variables: { channelId: channelId }, skip: !channelId })
  return {
    nfts: data?.videos.map((video) => video.nft),
    ...rest,
  }
}
