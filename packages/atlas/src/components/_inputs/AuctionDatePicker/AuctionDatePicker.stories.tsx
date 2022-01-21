import { Meta, Story } from '@storybook/react'
import { isValid } from 'date-fns'
import React, { useRef, useState } from 'react'

import { AuctionDatePicker, AuctionDatePickerProps } from './AuctionDatePicker'

export default {
  title: 'inputs/AuctionDatePicker',
  component: AuctionDatePicker,
  args: {
    // helperText: 'Lorem ipsum dolor sit amet...',
  },
} as Meta

const Template: Story<AuctionDatePickerProps> = (args) => {
  const [startDate, setStartDate] = useState<string | null>()
  const [expirationDate, setExpirationDate] = useState<string | null>()

  console.log({ startDate, expirationDate })
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
      <AuctionDatePicker {...args} items={[]} label="expiration date" />
    </div>
  )
}

export const Default = Template.bind({})
