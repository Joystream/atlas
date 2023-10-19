import { useGetFullCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { TokenDetails } from '@/components/_crt/TokenDetails/TokenDetails'

type ChannelTokenProps = {
  tokenId: string
}

export const ChannelToken = ({ tokenId }: ChannelTokenProps) => {
  const { data } = useGetFullCreatorTokenQuery({
    variables: {
      id: tokenId,
    },
  })

  if (!data?.creatorTokenById) {
    return
  }

  const { creatorTokenById } = data
  return (
    <LayoutGrid>
      <GridItem colSpan={{ base: 8 }}>
        <TokenDetails
          about={creatorTokenById?.description ?? ''}
          benefits={creatorTokenById?.benefits}
          videoId={creatorTokenById?.trailerVideo?.id}
        />
      </GridItem>
      <GridItem colSpan={{ base: 4 }}>kdfjlawsjkf</GridItem>
    </LayoutGrid>
  )
}
