import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import {
  SvgActionAuction,
  SvgActionCalendar,
  SvgActionClock,
  SvgActionFilters,
  SvgActionMember,
  SvgActionSettings,
} from '@/assets/icons'
import { CheckboxProps } from '@/components/_inputs/Checkbox'

import { SectionHeader, SectionHeaderProps } from './SectionHeader'

import { SelectItem } from '../../_inputs/Select'

const ITEMS: SelectItem[] = [
  { name: 'Newest', value: 'newest' },
  { name: 'Oldest', value: 'oldest' },
  { name: 'Most popular', value: 'popular' },
]

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
  return (
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
          items: ITEMS,
        },
      }}
      filters={[
        {
          label: 'Filters',
          icon: <SvgActionFilters />,
          onApply: () => null,
          options: [],
        },
      ]}
    />
  )
}

export const WithTabs = WithTabsTemplate.bind({})

const nftStatuses = [
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

const WithTitleTemplate: StoryFn<SectionHeaderProps> = () => {
  const [statuses, setStatuses] = useState<CheckboxProps[]>([])

  return (
    <div style={{ display: 'grid', gap: 64 }}>
      <SectionHeader
        sort={{
          type: 'select',
          selectProps: {
            value: 'oldest',
            inlineLabel: 'Sort by',
            items: ITEMS,
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
            label: 'Date uploaded',
            icon: <SvgActionCalendar />,
            onApply: (index) => console.log(index),
            options: [
              { id: 'a', label: 'a' },
              { id: 'b', label: 'b' },
            ],
          },
          {
            label: 'Length',
            icon: <SvgActionClock />,
            onApply: () => null,
            options: [],
          },
          {
            label: 'Status',
            icon: <SvgActionAuction />,
            selectedOptions: statuses,
            onApply: (options) => {
              setStatuses(options)
            },
            options: nftStatuses,
          },
          {
            label: 'Other filters',
            icon: <SvgActionSettings />,
            onApply: () => null,
            options: [],
          },
        ]}
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
            label: 'Date uploaded',
            icon: <SvgActionCalendar />,
            onApply: () => null,
            options: [],
          },
          {
            label: 'Length',
            icon: <SvgActionClock />,
            onApply: () => null,
            options: [],
          },
          {
            label: 'Auction type',
            icon: <SvgActionAuction />,
            onApply: () => null,
            options: [],
          },
          {
            label: 'Other filters',
            icon: <SvgActionSettings />,
            onApply: () => null,
            options: [],
          },
        ]}
        search={{}}
      />
    </div>
  )
}

export const WithTitle = WithTitleTemplate.bind({})
