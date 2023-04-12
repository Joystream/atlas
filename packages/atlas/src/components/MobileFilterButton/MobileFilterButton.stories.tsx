import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { FilterButtonOption, SectionFilter } from '@/components/FilterButton'
import { OverlayManagerProvider } from '@/providers/overlayManager'

import { MobileFilterButton, MobileFilterButtonProps } from './MobileFilterButton'

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

export default {
  title: 'other/MobileFilterButton',
  component: MobileFilterButton,
  args: {
    start: {
      type: 'title',
      title: 'Videos',
    },
  },
  decorators: [
    (Story: StoryFn) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta<MobileFilterButtonProps>

const DefaultTemplate: StoryFn<MobileFilterButtonProps> = (args) => {
  const [filters, setFilters] = useState<SectionFilter[]>([
    { name: 'nft-statuses', type: 'checkbox', options: NFT_STATUSES, label: 'Status' },
    { name: 'date-uploaded', type: 'radio', options: DATE_UPLOADED, label: 'Date uploaded' },
    { name: 'lengths', type: 'radio', options: LENGTHS, label: 'Length' },
    { name: 'other', type: 'checkbox', options: OTHER, label: 'Other' },
  ])
  return <MobileFilterButton {...args} filters={filters} onChangeFilters={setFilters} />
}

export const Default = DefaultTemplate.bind({})
