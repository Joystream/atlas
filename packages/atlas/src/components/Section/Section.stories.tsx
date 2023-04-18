import { ApolloProvider } from '@apollo/client'
import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { createApolloClient } from '@/api'
import {
  SvgActionAuction,
  SvgActionCalendar,
  SvgActionChevronR,
  SvgActionClock,
  SvgActionSettings,
} from '@/assets/icons'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { OverlayManagerProvider } from '@/providers/overlayManager'
import { UserProvider } from '@/providers/user/user.provider'
import { createPlaceholderData } from '@/utils/data'

import { Section, SectionProps } from './Section'

import { FilterButtonOption, SectionFilter } from '../FilterButton'
import { RankingNumberTile } from '../RankingNumberTile'
import { SelectItem } from '../_inputs/Select'
import { NftTile } from '../_nft/NftTile'
import { VideoTile } from '../_video/VideoTile'

const TABS = [
  {
    name: 'Videos',
  },
  {
    name: 'NFTs',
  },
  {
    name: 'Token',
  },
  {
    name: 'Information',
  },
  {
    name: 'About',
  },
]

const ORDER_ITEMS: SelectItem[] = [
  { name: 'Newest', value: 'newest' },
  { name: 'Oldest', value: 'oldest' },
  { name: 'Most popular', value: 'popular' },
]

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

const DATE_UPLOADED: FilterButtonOption[] = [
  {
    label: 'Last 24 hours',
    selected: false,
    applied: false,
    value: '1',
  },
  {
    label: 'Last 7 days',
    selected: false,
    applied: false,
    value: '7',
  },
  {
    label: 'Last 30 days',
    selected: false,
    applied: false,
    value: '30',
  },
  {
    label: 'Last 365 days',
    selected: false,
    applied: false,
    value: '365',
  },
]

const LENGTHS: FilterButtonOption[] = [
  { label: 'Less than 4 minutes', selected: false, applied: false, value: '0-to-4' },
  { label: '4 to 10 minutes', selected: false, applied: false, value: '4-to-10' },
  { label: 'More than 10 minutes', selected: false, applied: false, value: '4-to-9999' },
]

const OTHER: FilterButtonOption[] = [
  { label: 'Paid promotional material', selected: false, applied: false, value: 'promotional' },
  { label: 'Mature content rating', selected: false, applied: false, value: 'mature' },
]

const INITIAL_STATE: SectionFilter[] = [
  {
    name: 'date-uploaded',
    type: 'radio',
    options: DATE_UPLOADED,
    label: 'Date uploaded',
    icon: <SvgActionCalendar />,
  },
  { name: 'lengths', type: 'radio', options: LENGTHS, label: 'Length', icon: <SvgActionClock /> },
  { name: 'nft-statuses', type: 'checkbox', options: NFT_STATUSES, label: 'Status', icon: <SvgActionAuction /> },
  { name: 'other', type: 'checkbox', options: OTHER, label: 'Other', icon: <SvgActionSettings /> },
]
export default {
  title: 'other/Section',
  component: Section,
  decorators: [
    (Story) => {
      const apolloClient = createApolloClient()
      return (
        <BrowserRouter>
          <ApolloProvider client={apolloClient}>
            <ConfirmationModalProvider>
              <UserProvider>
                <OverlayManagerProvider>
                  <Story />
                </OverlayManagerProvider>
              </UserProvider>
            </ConfirmationModalProvider>
          </ApolloProvider>
        </BrowserRouter>
      )
    },
  ],
} as Meta

const DefaultTemplate: StoryFn<SectionProps> = () => {
  const [filters, setFilters] = useState<SectionFilter[]>(INITIAL_STATE)
  const [placeholdersCount, setPlaceholdersCount] = useState(8)
  const [secondPlaceholdersCount, setSecondPlaceholdersCount] = useState(8)

  const placeholderItems = createPlaceholderData(placeholdersCount)
  const secondPlaceholderItems = createPlaceholderData(secondPlaceholdersCount)
  return (
    <div style={{ paddingBottom: 48, display: 'grid', gap: 60 }}>
      <Section
        headerProps={{
          start: {
            type: 'title',
            title: 'All content',
          },
          button: {
            children: 'Browse',
            iconPlacement: 'right',
            icon: <SvgActionChevronR />,
          },
        }}
        contentProps={{
          type: 'grid',
          children: placeholderItems.map((_, idx) => (
            <VideoTile key={idx} loadingDetails={true} loadingAvatar={true} loadingThumbnail={true} />
          )),
        }}
        footerProps={{
          type: 'link',
          label: 'Load more',
          handleLoadMore: async () => setPlaceholdersCount((count) => count + 8),
        }}
      />
      <Section
        headerProps={{
          start: {
            type: 'tabs',
            tabsProps: {
              tabs: TABS,
              onSelectTab: () => null,
            },
          },
          sort: {
            type: 'select',
            selectProps: {
              value: 'oldest',
              inlineLabel: 'Sort by',
              items: ORDER_ITEMS,
            },
          },
          filters: filters,
          onApplyFilters: setFilters,
        }}
        contentProps={{
          type: 'grid',
          children: secondPlaceholderItems.map((_, idx) => (
            <VideoTile key={idx} loadingDetails={true} loadingAvatar={true} loadingThumbnail={true} />
          )),
        }}
        footerProps={{
          type: 'pagination',
          page: 1,
          itemsPerPage: 10,
          maxPaginationLinks: 3,
          onChangePage: () => null,
          totalCount: 20,
        }}
      />
      <Section
        headerProps={{
          start: {
            type: 'title',
            title: 'Nfts on sale',
          },
          filters: filters,
          onApplyFilters: setFilters,
        }}
        contentProps={{
          type: 'grid',
          children: secondPlaceholderItems.map((_, idx) => (
            <VideoTile key={idx} loadingDetails={true} loadingAvatar={true} loadingThumbnail={true} />
          )),
        }}
        footerProps={{
          reachEnd: true,
          type: 'infinite',
          fetchMore: async () => setSecondPlaceholdersCount((count) => count + 8),
        }}
      />
    </div>
  )
}

export const Default = DefaultTemplate.bind({})

const CarouselTemplate: StoryFn<SectionProps> = () => {
  const placeholderItems = createPlaceholderData(10)
  return (
    <div style={{ display: 'grid', gap: 64, paddingBottom: 200 }}>
      <Section
        headerProps={{
          start: {
            type: 'title',
            title: 'Carousel',
          },
        }}
        contentProps={{
          type: 'carousel',
          slidesPerView: 3,
          children: placeholderItems.map((_, idx) => (
            <RankingNumberTile key={idx} number={idx + 1}>
              <VideoTile
                loadingDetails={true}
                loadingAvatar={true}
                thumbnailUrl={`http://placekitten.com/g/${320 + idx}/180`}
              />
            </RankingNumberTile>
          )),
        }}
      />
      <Section
        headerProps={{
          start: {
            type: 'tabs',
            tabsProps: {
              tabs: TABS,
              onSelectTab: () => null,
            },
          },
        }}
        contentProps={{
          type: 'carousel',
          slidesPerView: 3,
          children: placeholderItems.map((_, idx) => (
            <RankingNumberTile key={idx} number={idx + 1}>
              <VideoTile
                loadingDetails={true}
                loadingAvatar={true}
                thumbnailUrl={`https://place.dog/${320 + idx}/180`}
              />
            </RankingNumberTile>
          )),
        }}
      />
      <Section
        headerProps={{
          start: {
            type: 'tabs',
            tabsProps: {
              tabs: TABS,
              onSelectTab: () => null,
            },
          },
        }}
        contentProps={{
          type: 'carousel',
          slidesPerView: 5,
          children: placeholderItems.map((_, idx) => (
            <NftTile
              key={idx}
              thumbnail={{ type: 'video', thumbnailUrl: `https://place.dog/${320 + idx}/180` }}
              title={`Nft number ${idx}`}
            />
          )),
        }}
      />
      <Section
        headerProps={{
          start: {
            type: 'tabs',
            tabsProps: {
              tabs: TABS,
              onSelectTab: () => null,
            },
          },
        }}
        contentProps={{
          type: 'carousel',
          slidesPerView: 5,
          children: placeholderItems.map((_, idx) => (
            <VideoTile
              key={idx}
              loadingDetails={true}
              loadingAvatar={true}
              thumbnailUrl={`https://place.dog/${320 + idx}/180`}
            />
          )),
        }}
      />
    </div>
  )
}

export const Carousel = CarouselTemplate.bind({})
