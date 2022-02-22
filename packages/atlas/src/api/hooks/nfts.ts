import { useGetNftQuery } from '@/api/queries'

export const useNft = (videoId: string) => {
  const { data, ...rest } = useGetNftQuery({ variables: { videoId: videoId }, skip: !videoId })

  return {
    nft: data?.ownedNfts[0],
    ...rest,
  }
}
