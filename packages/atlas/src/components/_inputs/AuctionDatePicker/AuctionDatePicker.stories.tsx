import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { AuctionDatePicker, AuctionDatePickerProps, SelectValue } from './AuctionDatePicker'

export default {
  title: 'inputs/AuctionDatePicker',
  component: AuctionDatePicker,
  args: {},
} as Meta

const Template: Story<AuctionDatePickerProps> = (args) => {
  const [startDate, setStartDate] = useState<SelectValue>(null)
  const [expirationDate, setExpirationDate] = useState<SelectValue>(null)

  return (
    <div style={{ display: 'flex', gap: '8px', width: '652px' }}>
      <AuctionDatePicker
        {...args}
        items={[
          {
            value: new Date(),
            name: 'Right after listing',
          },
        ]}
        onChange={(val) => setStartDate(val?.type === 'date' ? val.date : val?.durationDays)}
        value={startDate}
        label="starting date"
      />
      <AuctionDatePicker
        {...args}
        items={[
          {
            value: 1,
            name: '1 day',
          },
          {
            value: 7,
            name: '3 days',
          },
          {
            value: 5,
            name: '5 days',
          },
          {
            value: 7,
            name: '7 days',
          },
        ]}
        minDate={startDate instanceof Date ? startDate : null}
        onChange={(val) => setExpirationDate(val?.type === 'date' ? val.date : val?.durationDays)}
        value={expirationDate}
        label="expiration date"
      />
    </div>
  )
}

export const Default = Template.bind({})
