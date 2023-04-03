import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { SvgActionAuction, SvgActionCalendar, SvgActionClock, SvgActionMember, SvgActionSettings } from '@/assets/icons'
import { CheckboxOption, RadioOption } from '@/components/FilterButton'

import { SectionHeader, SectionHeaderProps } from './SectionHeader'

import { SelectItem } from '../../_inputs/Select'

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

const NFT_STATUSES: CheckboxOption[] = [
  {
    id: 'AuctionTypeEnglish',
    label: 'Timed auction',
  },
  {
    id: 'AuctionTypeOpen',
    label: 'Open auction',
  },
  {
    id: 'TransactionalStatusBuyNow',
    label: 'Fixed price',
  },
  {
    id: 'TransactionalStatusIdle',
    label: 'Not for sale',
  },
]

const DATE_UPLOADED: RadioOption[] = [
  {
    label: 'Last 24 hours',
    value: '1',
  },
  {
    label: 'Last 7 days',
    value: '7',
  },
  {
    label: 'Last 30 days',
    value: '30',
  },
  {
    label: 'Last 365 days',
    value: '365',
  },
]

const LENGTHS: RadioOption[] = [
  { label: 'Less than 4 minutes', value: '0-to-4' },
  { label: '4 to 10 minutes', value: '4-to-10' },
  { label: 'More than 10 minutes', value: '4-to-9999' },
]

const OTHER: CheckboxOption[] = [
  { label: 'Paid promotional material', value: false },
  { label: 'Mature content rating', value: false },
]

const INITIAL_STATE = {
  dateUploaded: null,
  length: null,
  statuses: [],
  otherFilters: [],
}

export default {
  title: 'other/SectionHeader',
  component: SectionHeader,
  args: {
    start: {
      type: 'title',
      title: 'Videos',
    },
  },
} as Meta<SectionHeaderProps>

const DefaultTemplate: StoryFn<SectionHeaderProps> = (args) => {
  return <SectionHeader {...args} />
}

export const Default = DefaultTemplate.bind({})
Default.args = {}

const WithTabsTemplate = () => {
  const [filters, setFilters] = useState(INITIAL_STATE)

  const handleSetCheckbox = (filter: 'statuses' | 'otherFilters') => (selectedOptions: CheckboxOption[]) => {
    setFilters((prev) => ({ ...prev, [filter]: selectedOptions }))
  }

  const handleSetRadio = (filter: 'dateUploaded' | 'length') => (selectedOption: RadioOption | null) => {
    setFilters((prev) => ({ ...prev, [filter]: selectedOption }))
  }

  return (
    <div style={{ display: 'grid', gap: 64 }}>
      <SectionHeader
        search={{}}
        start={{
          type: 'tabs',
          tabsProps: {
            tabs: TABS,
            onSelectTab: () => null,
            selected: 0,
          },
        }}
        sort={{
          type: 'select',
          selectProps: {
            value: 'oldest',
            inlineLabel: 'Sort by',
            items: ORDER_ITEMS,
          },
        }}
        filters={[
          {
            type: 'radio',
            label: 'Date uploaded',
            icon: <SvgActionCalendar />,
            selectedOption: filters.dateUploaded,
            onApply: handleSetRadio('dateUploaded'),
            options: DATE_UPLOADED,
          },
          {
            label: 'Length',
            type: 'radio',
            icon: <SvgActionClock />,
            selectedOption: filters.length,
            onApply: handleSetRadio('length'),
            options: LENGTHS,
          },
          {
            type: 'checkbox',
            label: 'Status',
            icon: <SvgActionAuction />,
            selectedOptions: filters.statuses,
            onApply: handleSetCheckbox('statuses'),
            options: NFT_STATUSES,
          },
          {
            type: 'checkbox',
            label: 'Other filters',
            selectedOptions: filters.otherFilters,
            icon: <SvgActionSettings />,
            onApply: handleSetCheckbox('otherFilters'),
            options: OTHER,
          },
        ]}
        onResetFilters={() => {
          setFilters(INITIAL_STATE)
        }}
      />

      <SectionHeader
        search={{}}
        start={{
          type: 'tabs',
          tabsProps: {
            tabs: [...TABS, { name: 'More Tabs' }, { name: 'Moooar tabs' }],
            onSelectTab: () => null,
            selected: 0,
          },
        }}
        sort={{
          type: 'select',
          selectProps: {
            value: 'oldest',
            inlineLabel: 'Sort by',
            items: ORDER_ITEMS,
          },
        }}
      />
    </div>
  )
}

export const WithTabs = WithTabsTemplate.bind({})

const WithTitleTemplate: StoryFn<SectionHeaderProps> = () => {
  const [filters, setFilters] = useState(INITIAL_STATE)

  const handleSetCheckbox = (filter: 'statuses' | 'otherFilters') => (selectedOptions: CheckboxOption[]) => {
    setFilters((prev) => ({ ...prev, [filter]: selectedOptions }))
  }

  const handleSetRadio = (filter: 'dateUploaded' | 'length') => (selectedOption: RadioOption | null) => {
    setFilters((prev) => ({ ...prev, [filter]: selectedOption }))
  }

  return (
    <div style={{ display: 'grid', gap: 64 }}>
      <SectionHeader
        sort={{
          type: 'select',
          selectProps: {
            value: 'oldest',
            inlineLabel: 'Sort by',
            items: ORDER_ITEMS,
          },
        }}
        start={{
          type: 'title',
          title: 'Icon',
          nodeStart: {
            type: 'avatar',
            avatarProps: {
              assetUrl: 'https://placekitten.com/g/200/300',
            },
          },
        }}
      />
      <SectionHeader
        sort={{
          type: 'select',
          selectProps: {
            value: 'oldest',
            inlineLabel: 'Sort by',
            items: ORDER_ITEMS,
          },
        }}
        start={{
          type: 'title',
          title: 'Icon',
          nodeStart: {
            type: 'icon',
            iconWrapperProps: {
              icon: <SvgActionMember />,
            },
          },
        }}
        filters={[
          {
            type: 'radio',
            label: 'Date uploaded',
            icon: <SvgActionCalendar />,
            selectedOption: filters.dateUploaded,
            onApply: handleSetRadio('dateUploaded'),
            options: DATE_UPLOADED,
          },
          {
            label: 'Length',
            type: 'radio',
            icon: <SvgActionClock />,
            selectedOption: filters.length,
            onApply: handleSetRadio('length'),
            options: LENGTHS,
          },
          {
            type: 'checkbox',
            label: 'Status',
            icon: <SvgActionAuction />,
            selectedOptions: filters.statuses,
            onApply: handleSetCheckbox('statuses'),
            options: NFT_STATUSES,
          },
          {
            type: 'checkbox',
            label: 'Other filters',
            icon: <SvgActionSettings />,
            selectedOptions: filters.otherFilters,
            onApply: handleSetCheckbox('otherFilters'),
            options: OTHER,
          },
        ]}
        onResetFilters={() => {
          setFilters(INITIAL_STATE)
        }}
      />
      <SectionHeader
        start={{
          type: 'title',
          title: 'Custom title',
          nodeStart: {
            type: 'custom',
            node: <div style={{ width: 24, height: 24, background: 'blue', borderRadius: 5 }} />,
          },
        }}
        sort={{
          type: 'toggle-button',
          toggleButtonOptionTypeProps: {
            type: 'options',
            options: ['Newest', 'Oldest'],
            onChange: () => null,
          },
        }}
        filters={[
          {
            type: 'radio',
            label: 'Date uploaded',
            icon: <SvgActionCalendar />,
            selectedOption: filters.dateUploaded,
            onApply: handleSetRadio('dateUploaded'),
            options: DATE_UPLOADED,
          },
          {
            label: 'Length',
            type: 'radio',
            icon: <SvgActionClock />,
            selectedOption: filters.length,
            onApply: handleSetRadio('length'),
            options: LENGTHS,
          },
          {
            type: 'checkbox',
            label: 'Status',
            icon: <SvgActionAuction />,
            selectedOptions: filters.statuses,
            onApply: handleSetCheckbox('statuses'),
            options: NFT_STATUSES,
          },
          {
            type: 'checkbox',
            label: 'Other filters',
            icon: <SvgActionSettings />,
            selectedOptions: filters.otherFilters,
            onApply: handleSetCheckbox('otherFilters'),
            options: OTHER,
          },
        ]}
        onResetFilters={() => {
          setFilters(INITIAL_STATE)
        }}
        search={{}}
      />
    </div>
  )
}

export const WithTitle = WithTitleTemplate.bind({})
