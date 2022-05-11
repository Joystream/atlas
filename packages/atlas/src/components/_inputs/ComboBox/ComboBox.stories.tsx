import { Meta, Story } from '@storybook/react'
import React from 'react'

import { SvgActionCancel } from '@/components/_icons'

import { ComboBox, ComboBoxProps } from '.'

const MEMBERS = [
  'Klaudiusz',
  'Diego',
  'Rafal',
  'Loic',
  'Bartosz',
  'Klaudiusz the Second',
  'Diego the Second',
  'Rafal the Second',
  'Loic the Second',
  'Bartosz the Second',
  'Klaudiusz the Third',
  'Diego the Third',
  'Rafal the Third',
  'Loic the Third',
  'Bartosz the Third',
]

export default {
  title: 'inputs/ComboBox',
  component: ComboBox,
  argTypes: {
    items: { table: { disable: true } },
    type: { table: { disable: true } },
    isSelect: { table: { disable: true } },
    nodeStart: { table: { disable: true } },
    nodeEnd: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    onFocus: { table: { disable: true } },
    onKeyDown: { table: { disable: true } },
    onSelectedItemChange: { table: { disable: true } },
    onInputValueChange: { table: { disable: true } },
    notFoundNode: { table: { disable: true } },
    autoComplete: { table: { disable: true } },
    name: { table: { disable: true } },
    value: { table: { disable: true } },
    required: { table: { disable: true } },
    className: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    charactersCount: { table: { disable: true } },
    maxLength: { table: { disable: true } },
  },
  args: {
    label: 'Find user',
    placeholder: 'Type name here',
    notFoundNode: {
      label: 'Item not found',
      nodeStart: <SvgActionCancel />,
    },
    helperText: 'Some helper text here',
  },
} as Meta

const Template: Story<ComboBoxProps> = (args) => {
  return <ComboBox items={MEMBERS.map((member) => ({ label: member }))} {...args} />
}

export const Default = Template.bind({})
