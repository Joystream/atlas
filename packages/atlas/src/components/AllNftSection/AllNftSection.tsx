import styled from '@emotion/styled'
import { useMemo, useState } from 'react'

import { useNftsConnection } from '@/api/hooks/nfts'
import { OwnedNftOrderByInput, OwnedNftWhereInput } from '@/api/queries/__generated__/baseTypes.generated'
import { SvgActionSell, SvgActionSettings, SvgActionShoppingCart } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { FilterButtonOption, SectionFilter } from '@/components/FilterButton'
import { NumberFormat } from '@/components/NumberFormat'
import { Section } from '@/components/Section/Section'
import { Button } from '@/components/_buttons/Button'
import { NftTileViewer } from '@/components/_nft/NftTileViewer'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { createPlaceholderData } from '@/utils/data'

const NFT_STATUSES: FilterButtonOption[] = [
  {
    value: 'AuctionTypeEnglish',
    selected: false,
    applied: false,
    label: 'Timed auction',
  },
  {
    value: 'AuctionTypeOpen',
    selected: false,
    applied: false,
    label: 'Open auction',
  },
  {
    value: 'TransactionalStatusBuyNow',
    selected: false,
    applied: false,
    label: 'Fixed price',
  },
  {
    value: 'TransactionalStatusIdle',
    selected: false,
    applied: false,
    label: 'Not for sale',
  },
]

const OTHER: FilterButtonOption[] = [
  { label: 'Exclude paid promotional materials', selected: false, applied: false, value: 'promotional' },
  { label: 'Exclude mature content rating', selected: false, applied: false, value: 'mature' },
]

const FILTERS: SectionFilter[] = [
  {
    name: 'price',
    type: 'range',
    label: 'Price',
    icon: <SvgActionSell />,
    range: { min: undefined, max: undefined },
  },
  {
    name: 'status',
    label: 'Status',
    icon: <SvgActionShoppingCart />,
    type: 'checkbox',
    options: NFT_STATUSES,
  },
  { name: 'other', type: 'checkbox', options: OTHER, label: 'Other', icon: <SvgActionSettings /> },
]

const LIMIT = 12
const LG_LIMIT = 30

export const AllNftSection = () => {
  const [filters, setFilters] = useState<SectionFilter[]>(FILTERS)
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false)
  const [order, setOrder] = useState<OwnedNftOrderByInput>(OwnedNftOrderByInput.CreatedAtDesc)
  const smMatch = useMediaMatch('sm')
  const lgMatch = useMediaMatch('lg')
  const limit = lgMatch ? LG_LIMIT : LIMIT
  const mappedFilters = useMemo((): OwnedNftWhereInput => {
    const mappedStatus =
      filters
        .find((filter) => filter.name === 'status')
        ?.options?.filter((option) => option.applied)
        .map((option) => {
          if (['AuctionTypeOpen', 'AuctionTypeEnglish'].includes(option.value)) {
            return {
              auction: {
                auctionType: {
                  isTypeOf_eq: option.value,
                },
              },
            }
          }

          return { isTypeOf_eq: option.value }
        }, [] as OwnedNftWhereInput['transactionalStatus'][])
        .filter((filter) => !!filter) ?? []
    const otherFilters = filters.find((filter) => filter.name === 'other')
    const isMatureExcluded = otherFilters?.options?.some((option) => option.value === 'mature' && option.applied)
    const isPromotionalExcluded = otherFilters?.options?.some(
      (option) => option.value === 'promotional' && option.applied
    )
    const priceFilter = filters.find((filter) => filter.name === 'price')
    const minPrice = priceFilter?.range?.appliedMin
    const maxPrice = priceFilter?.range?.appliedMax

    setHasAppliedFilters(
      Boolean(minPrice || maxPrice || isPromotionalExcluded || isMatureExcluded || mappedStatus.length)
    )

    const commonFilters = {
      lastSalePrice_gte: minPrice ? String(minPrice) : undefined,
      lastSalePrice_lte: maxPrice ? String(maxPrice) : undefined,
      video: {
        ...(isMatureExcluded ? { isExcluded_eq: false } : {}),
        ...(isPromotionalExcluded ? { hasMarketing_eq: false } : {}),
      },
    }
    return {
      OR: mappedStatus.length
        ? mappedStatus.map((transactionalStatus) => ({
            ...commonFilters,
            transactionalStatus,
          }))
        : [commonFilters],
    }
  }, [filters])

  const { nfts, loading, totalCount, fetchMore, pageInfo } = useNftsConnection({
    where: mappedFilters,
    orderBy: order,
    first: limit,
  })
  const [isLoading, setIsLoading] = useState(false)

  const placeholderItems = loading || isLoading ? createPlaceholderData(limit) : []
  const nftsWithPlaceholders = [...(nfts || []), ...placeholderItems]
  return (
    <Section
      headerProps={{
        onApplyFilters: setFilters,
        start: {
          type: 'title',
          title: 'All NFTs',
          nodeEnd:
            typeof totalCount === 'number' ? (
              <NumberFormat value={totalCount} as="p" variant={smMatch ? 'h500' : 'h400'} color="colorTextMuted" />
            ) : undefined,
        },
        filters,
        sort: {
          type: 'toggle-button',
          toggleButtonOptionTypeProps: {
            type: 'options',
            options: ['Newest', 'Oldest'],
            value: order === OwnedNftOrderByInput.CreatedAtDesc ? 'Newest' : 'Oldest',
            onChange: (order) =>
              setOrder(order === 'Oldest' ? OwnedNftOrderByInput.CreatedAtAsc : OwnedNftOrderByInput.CreatedAtDesc),
          },
        },
      }}
      contentProps={{
        type: 'grid',
        minChildrenWidth: 250,
        children:
          !(isLoading || loading) && !nfts?.length
            ? [
                <FallbackContainer key="fallback">
                  <EmptyFallback
                    title="No NFTs found"
                    subtitle="Please, try changing your filtering criteria."
                    button={
                      hasAppliedFilters && (
                        <Button variant="secondary" onClick={() => setFilters(FILTERS)}>
                          Clear all filters
                        </Button>
                      )
                    }
                  />
                </FallbackContainer>,
              ]
            : nftsWithPlaceholders.map((nft, idx) => <NftTileViewer key={(nft.id ?? '') + idx} nftId={nft.id} />),
      }}
      footerProps={{
        type: 'infinite',
        reachedEnd: !pageInfo?.hasNextPage ?? true,
        fetchMore: async () => {
          setIsLoading(true)
          await fetchMore({
            variables: {
              after: pageInfo?.endCursor,
            },
          }).finally(() => {
            setIsLoading(false)
          })
        },
      }}
    />
  )
}

export const FallbackContainer = styled.div`
  grid-column: 1/-1;
`
