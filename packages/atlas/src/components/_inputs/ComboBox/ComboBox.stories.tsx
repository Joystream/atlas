import { Meta, Story } from '@storybook/react'
import React from 'react'

import { SvgActionCancel } from '@/components/_icons'

import { ComboBox, ComboBoxProps } from '.'

const MEMBERS = [
  {
    label: 'Klaudiusz',
    thumbnailUrl: 'https://placedog.net/57/32?random=1',
  },
  {
    label: 'Diego',
    thumbnailUrl: 'https://placedog.net/57/32?random=2',
  },
  {
    label: 'Rafal',
    thumbnailUrl: 'https://placedog.net/57/32?random=3',
  },
  {
    label: 'Loic',
    thumbnailUrl: 'https://placedog.net/57/32?random=4',
  },
  {
    label: 'Bartosz',
    thumbnailUrl: 'https://placedog.net/57/32?random=5',
  },
  {
    label: 'Klaudiusz the Second',
    thumbnailUrl: 'https://placedog.net/57/32?random=6',
  },
  {
    label: 'Diego the Second',
    thumbnailUrl: 'https://placedog.net/57/32?random=7',
  },
  {
    label: 'Rafal the Second',
    thumbnailUrl: 'https://placedog.net/57/32?random=8',
  },
  {
    label: 'Loic the Second',
    thumbnailUrl: 'https://placedog.net/57/32?random=9',
  },
  {
    label: 'Bartosz the Second',
    thumbnailUrl: 'https://placedog.net/57/32?random=10',
  },
  {
    label: 'Klaudiusz the Third',
    thumbnailUrl: 'https://placedog.net/57/32?random=11',
  },
  {
    label: 'Diego the Third',
    thumbnailUrl: 'https://placedog.net/57/32?random=12',
  },
  {
    label: 'Rafal the Third',
    thumbnailUrl: 'https://placedog.net/57/32?random=13',
  },
  {
    label: 'Loic the Third',
    thumbnailUrl: 'https://placedog.net/57/32?random=14',
  },
  {
    label: 'Bartosz the Third',
    thumbnailUrl: 'https://placedog.net/57/32?random=15',
  },
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
    onWheel: { table: { disable: true } },
  },
  args: {
    label: 'Find user',
    placeholder: 'Type name here',
    notFoundNode: {
      label: 'Item not found',
      nodeStart: <SvgActionCancel />,
    },
    helperText: 'Some helper text here',
    loading: false,
    noseStart: false,
  },
} as Meta

const Template: Story<ComboBoxProps> = (args) => {
  return <ComboBox items={MEMBERS.map((member) => ({ label: member.label }))} {...args} />
}

export const Default = Template.bind({})

const TemplateWithNodeStart: Story<ComboBoxProps> = (args) => {
  return <ComboBox items={MEMBERS} {...args} />
}

export const WithNodeStart = TemplateWithNodeStart.bind({})
