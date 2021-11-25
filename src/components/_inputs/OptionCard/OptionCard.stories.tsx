import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { OptionCard, OptionCardProps } from './OptionCard'

export default {
  title: 'inputs/OptionCard',
  component: OptionCard,
  args: {
    label: 'Radio input label',
    helperText: 'Radio helper text',
    disabled: false,
    error: false,
  },
} as Meta

const Template: Story<OptionCardProps> = (args) => {
  const [selected, setSelected] = useState<string | number>('1')
  const handleClick: (e: React.MouseEvent<HTMLElement>) => void = (e) => {
    const element = e.currentTarget as HTMLInputElement
    setSelected(element.value)
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '16px' }}>
      <OptionCard {...args} value="1" selectedValue={selected} onClick={handleClick} />
      <OptionCard {...args} value="2" selectedValue={selected} onClick={handleClick} />
    </div>
  )
}

export const Default = Template.bind({})
