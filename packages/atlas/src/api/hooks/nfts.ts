import {
  VideoCategoryWhereInput,
  VideoOrderByInput,
  useGetNftQuery,
  useGetNftsQuery,
  useGetVideosConnectionQuery,
} from '@/api/queries'
import { createLookup } from '@/utils/data'

export const useNft = (id: string) => {
  const { data, ...rest } = useGetNftQuery({ variables: { id }, skip: !id })

  return {
    nft: data?.ownedNftByUniqueInput,
    ...rest,
  }
}

type ChannelNftsOpts = {
  category?: VideoCategoryWhereInput | null
  sortNftsBy?: VideoOrderByInput
}

export const useChannelNfts = (channelId: string, opts?: ChannelNftsOpts) => {
  const {
    data: videosConnectionData,
    loading: videosConnectionLoading,
    ...rest
  } = useGetVideosConnectionQuery({
    variables: {
      orderBy: opts?.sortNftsBy,
      where: {
        channel: { id_eq: channelId },
        nft: {
          metadata_contains: '',
        },
        isPublic_eq: true,
        isCensored_eq: false,

        thumbnailPhoto: {
          isAccepted_eq: true,
        },
        media: {
          isAccepted_eq: true,
        },
        ...(opts?.category?.id_in?.length
          ? {
              category: {
                id_in: opts.category.id_in,
              },
            }
          : {}),
      },
    },
  })

  const idIn = videosConnectionData?.videosConnection.edges.map((edge) => edge.node.id) || []

  const { data: nftsData, loading: nftsLoading } = useGetNftsQuery({
    variables: {
      where: {
        id_in: idIn,
      },
    },
    skip: !idIn.length || videosConnectionLoading,
  })

  const nftsDataLookup = nftsData?.ownedNfts ? createLookup(nftsData?.ownedNfts) : {}

  const nfts = videosConnectionData?.videosConnection.edges.map((video) => ({
    ...video.node,
    nft: nftsDataLookup[video.node.id],
  }))

  return {
    nfts: nftsData?.ownedNfts.length ? nfts : undefined,
    totalCount: videosConnectionData?.videosConnection.totalCount,
    pageInfo: videosConnectionData?.videosConnection.pageInfo,
    loading: nftsLoading || videosConnectionLoading,
    ...rest,
  }
}
