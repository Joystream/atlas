import styled from '@emotion/styled'
import { useMemo, useState } from 'react'

import { OwnedNftOrderByInput, OwnedNftWhereInput } from '@/api/queries/__generated__/baseTypes.generated'
import { SvgActionSell, SvgActionSettings, SvgActionShoppingCart } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { FilterButtonOption, SectionFilter } from '@/components/FilterButton'
import { Section } from '@/components/Section/Section'
import { Button } from '@/components/_buttons/Button'
import { NftTileViewer } from '@/components/_nft/NftTileViewer'
import { publicVideoFilter } from '@/config/contentFilter'
import { useInfiniteNftsGrid } from '@/hooks/useInfiniteNftsGrid'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { DEFAULT_NFTS_GRID } from '@/styles'

import { NumberFormat } from '../NumberFormat'

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
    label: 'Last price',
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

const sortingOptions = [
  {
    label: 'Newest',
    value: OwnedNftOrderByInput.CreatedAtDesc,
  },
  {
    label: 'Oldest',
    value: OwnedNftOrderByInput.CreatedAtAsc,
  },
]

export const AllNftSection = () => {
  const [filters, setFilters] = useState<SectionFilter[]>(FILTERS)
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false)
  const [order, setOrder] = useState<OwnedNftOrderByInput>(OwnedNftOrderByInput.CreatedAtDesc)
  const smMatch = useMediaMatch('sm')
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
        }, [] as OwnedNftWhereInput['transactionalStatus'][]) ?? []
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
      lastSalePrice_gte: minPrice ? tokenNumberToHapiBn(minPrice).toString() : undefined,
      lastSalePrice_lte: maxPrice ? tokenNumberToHapiBn(maxPrice).toString() : undefined,
      video: {
        ...publicVideoFilter,
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

  const { columns, fetchMore, pageInfo, tiles, totalCount } = useInfiniteNftsGrid({
    where: mappedFilters,
    orderBy: order,
  })

  const children = tiles?.map((nft, idx) => <NftTileViewer key={idx} nftId={nft.id} />)
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
            options: sortingOptions,
            value: order,
            onChange: setOrder,
          },
        },
      }}
      contentProps={{
        type: 'grid',
        grid: DEFAULT_NFTS_GRID,
        children: children.length
          ? children
          : [
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
            ],
      }}
      footerProps={{
        type: 'infinite',
        reachedEnd: !pageInfo?.hasNextPage ?? true,
        fetchMore: async () => {
          if (pageInfo?.hasNextPage) {
            await fetchMore({
              variables: {
                first: columns * 4,
                after: pageInfo?.endCursor,
              },
            })
          }
        },
      }}
    />
  )
}

export const FallbackContainer = styled.div`
  grid-column: 1/-1;
`
