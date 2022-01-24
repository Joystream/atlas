import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { AuctionDatePicker, AuctionDatePickerProps } from './AuctionDatePicker'

export default {
  title: 'inputs/AuctionDatePicker',
  component: AuctionDatePicker,
  args: {},
} as Meta

const Template: Story<AuctionDatePickerProps> = (args) => {
  const [startDate, setStartDate] = useState<string | null>()
  const [expirationDate, setExpirationDate] = useState<string | null>()

  return (
    <div style={{ display: 'flex', gap: '8px', width: '652px' }}>
      <AuctionDatePicker
        {...args}
        items={[
          {
            value: 'Fri Jan 21 2022 14:40:12 GMT+0100 (hora estándar de Europa central)',
            name: 'Right after listing',
          },
        ]}
        onChange={setStartDate}
        value={startDate}
        label="starting date"
      />
      <AuctionDatePicker
        {...args}
        items={[
          {
            value: 'Fri Jan 21 2022 14:40:12 GMT+0100 (hora estándar de Europa central)',
            name: '1 day',
          },
          {
            value: 'Fri Jan 22 2022 14:40:12 GMT+0100 (hora estándar de Europa central)',
            name: '3 days',
          },
          {
            value: 'Fri Jan 23 2022 14:40:12 GMT+0100 (hora estándar de Europa central)',
            name: '5 days',
          },
          {
            value: 'Fri Jan 24 2022 14:40:12 GMT+0100 (hora estándar de Europa central)',
            name: '7 days',
          },
        ]}
        onChange={setExpirationDate}
        value={expirationDate}
        label="expiration date"
      />
    </div>
  )
}

export const Default = Template.bind({})
