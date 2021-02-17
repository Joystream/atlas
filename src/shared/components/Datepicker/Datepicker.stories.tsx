import React, { useRef } from 'react'
import Datepicker from './Datepicker'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'Shared/Datepicker',
  component: Datepicker,
} as Meta

const Template: Story = (args) => {
  const ref = useRef<HTMLInputElement | null>(null)
  return (
    <>
      <Datepicker ref={ref} {...args} />
    </>
  )
}

export const Default = Template.bind({})
