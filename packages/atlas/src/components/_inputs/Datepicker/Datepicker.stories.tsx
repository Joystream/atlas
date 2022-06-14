import { Meta, Story } from '@storybook/react'
import { isValid } from 'date-fns'
import { useRef, useState } from 'react'

import { Datepicker, DatepickerProps } from './Datepicker'

export default {
  title: 'inputs/Datepicker',
  component: Datepicker,
  args: {
    helperText: 'Lorem ipsum dolor sit amet...',
  },
} as Meta

const Template: Story<DatepickerProps> = (args) => {
  const ref = useRef<HTMLInputElement | null>(null)
  const [date, setDate] = useState<Date | null>()
  const [validationError, setValidationError] = useState(false)

  const handleDateValidation = () => {
    if (!date) {
      return
    }
    setValidationError(!isValid(date))
  }
  return (
    <>
      <Datepicker {...args} ref={ref} onChange={setDate} onBlur={handleDateValidation} error={validationError} />
      <span>{date ? (isValid(date) ? date.toISOString() : 'Invalid date') : 'No date'}</span>
    </>
  )
}

export const Default = Template.bind({})
