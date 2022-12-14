import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { pluralizeNoun } from '@/utils/misc'

import { AuctionDatePicker, AuctionDatePickerProps, AuctionDatePickerValue } from './AuctionDatePicker'

export default {
  title: 'inputs/AuctionDatePicker',
  component: AuctionDatePicker,
  args: {},
} as Meta

const Template: StoryFn<AuctionDatePickerProps> = (args) => {
  const [startDate, setStartDate] = useState<AuctionDatePickerValue>(null)
  const [expirationDate, setExpirationDate] = useState<AuctionDatePickerValue>(null)

  const days = [null, 1, 3, 5, 7] as const

  const expirationDateItems = days.map((value) => ({
    name: value === null ? 'No expiration date' : pluralizeNoun(value, 'day'),
    value:
      value === null
        ? null
        : {
            type: 'duration' as const,
            durationDays: value,
          },
  }))
  return (
    <div style={{ display: 'flex', gap: '8px', width: '652px' }}>
      <AuctionDatePicker
        {...args}
        items={[
          {
            value: null,
            name: 'Now',
          },
        ]}
        onChange={setStartDate}
        value={startDate}
        inlineLabel="starting date"
      />
      <AuctionDatePicker
        {...args}
        items={expirationDateItems}
        minDate={startDate?.type === 'date' ? startDate.date : null}
        onChange={setExpirationDate}
        value={expirationDate}
        inlineLabel="expiration date"
      />
    </div>
  )
}

export const Default = Template.bind({})
