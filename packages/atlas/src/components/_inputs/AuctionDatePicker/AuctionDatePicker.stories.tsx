import { Meta, Story } from '@storybook/react'
import { isValid } from 'date-fns'
import React, { useState } from 'react'

import { AuctionDatePicker, AuctionDatePickerProps } from './AuctionDatePicker'

export default {
  title: 'inputs/AuctionDatePicker',
  component: AuctionDatePicker,
  args: {},
} as Meta

const Template: Story<AuctionDatePickerProps> = (args) => {
  const [startDate, setStartDate] = useState<string | null>(null)
  const [expirationDate, setExpirationDate] = useState<string | null>(null)
  // eslint-disable-next-line no-console
  console.log({ startDate, expirationDate })
  return (
    <div style={{ display: 'flex', gap: '8px', width: '652px' }}>
      <AuctionDatePicker
        {...args}
        items={[
          {
            value: 'Fri Jan 7 2022 14:40:12 GMT+0100 (hora estándar de Europa central)',
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
        minDate={isValid(new Date(startDate ?? '')) ? new Date(startDate as string) : undefined}
        onChange={setExpirationDate}
        value={expirationDate}
        label="expiration date"
      />
    </div>
  )
}

export const Default = Template.bind({})
