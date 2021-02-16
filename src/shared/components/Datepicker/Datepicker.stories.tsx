import React, { useRef, useEffect } from 'react'
import Datepicker from './Datepicker'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'Shared/Datepicker',
  component: Datepicker,
} as Meta

const Template: Story = (args) => {
  const ref = useRef<HTMLInputElement | null>(null)
  const handleInputChange: (e: Event) => void = (e) => {
    // @ts-ignore event input type
    if (!ref.current || e.inputType === 'deleteContentBackward') {
      return
    }
    if (/^[1-9][0-9]$/.test(ref.current.value) || /(^[0-9][0-9](\s+\/\s+)[0-9][0-9]$)/.test(ref.current.value)) {
      ref.current.value = ref.current.value + ' / '
    }
  }
  useEffect(() => {
    const datepicker = ref.current
    datepicker?.addEventListener('input', handleInputChange)
    return () => {
      datepicker?.removeEventListener('input', handleInputChange)
    }
  }, [])

  return (
    <>
      <Datepicker ref={ref} {...args} />
    </>
  )
}

export const Default = Template.bind({})
