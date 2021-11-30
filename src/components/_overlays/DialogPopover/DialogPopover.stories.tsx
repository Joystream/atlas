import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'

import { DialogPopover } from './DialogPopover'

export default {
  title: 'overlays/DialogPopover',
  component: DialogPopover,
  argTypes: {
    dividers: {
      type: { name: 'boolean', required: false },
    },
  },
  args: {
    title: "I'm a title",
    dividers: false,
  },
} as Meta

const Template: Story = (args) => {
  return (
    <div>
      <DialogPopover
        {...args}
        trigger={<Button onClick={() => null}>Open menu on the left side</Button>}
        primaryButton={{
          text: 'Action1',
        }}
        secondaryButton={{
          text: 'Action2',
        }}
      >
        <Text variant="t200">Example text</Text>
        <Text variant="t200">Example text</Text>
        <Text variant="t200">Example text</Text>
        <Text variant="t200">Example text</Text>
        <Text variant="t200">Example text</Text>
        <Text variant="t200">Example text</Text>
        <Text variant="t200">Example text</Text>
      </DialogPopover>
    </div>
  )
}

export const Regular = Template.bind({})
