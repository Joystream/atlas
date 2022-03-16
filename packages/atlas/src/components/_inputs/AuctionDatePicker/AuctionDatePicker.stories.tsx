import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { pluralizeNoun } from '@/utils/misc'

import { AuctionDatePicker, AuctionDatePickerProps, AuctionDatePickerValue } from './AuctionDatePicker'

export default {
  title: 'inputs/AuctionDatePicker',
  component: AuctionDatePicker,
  args: {},
} as Meta

const Template: Story<AuctionDatePickerProps> = (args) => {
  const [startDate, setStartDate] = useState<AuctionDatePickerValue>(null)
  const [expirationDate, setExpirationDate] = useState<AuctionDatePickerValue>(null)

  const days = [null, 1, 3, 5, 7] as const

  const expirationDateItems = days.map((value) => ({
    name: value === null ? 'No expiration date' : pluralizeNoun(value, 'day'),
    value: {
      type: 'duration',
      durationDays: value,
    } as AuctionDatePickerValue,
  }))
  return (
    <div style={{ display: 'flex', gap: '8px', width: '652px' }}>
      <AuctionDatePicker
        {...args}
        items={[
          {
            value: {
              type: 'duration',
              durationDays: null,
            },
            name: 'Right after listing',
          },
        ]}
        onChange={setStartDate}
        value={startDate}
        label="starting date"
      />
      <AuctionDatePicker
        {...args}
        items={expirationDateItems}
        minDate={startDate instanceof Date ? startDate : null}
        onChange={setExpirationDate}
        value={expirationDate}
        label="expiration date"
      />
    </div>
  )
}

export const Default = Template.bind({})
