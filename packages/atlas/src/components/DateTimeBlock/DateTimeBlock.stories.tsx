import { Meta } from '@storybook/react'

import { DateTimeBlockProps, DateTimeBlock as _DateTimeBlock } from './DateTimeBlock'

export default {
  title: 'crt/DateTimeBlock',
  component: _DateTimeBlock,
  args: {
    type: 'date',
    date: new Date(),
  },
} as Meta<DateTimeBlockProps>

export const DateTimeBlock = {}
