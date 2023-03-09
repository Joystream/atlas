import { Meta, StoryFn } from '@storybook/react'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'

import { DialogPopover } from './DialogPopover'

export default {
  title: 'overlays/DialogPopover',
  component: DialogPopover,
  args: {
    title: "I'm a title",
    dividers: false,
  },
} as Meta

const Template: StoryFn = (args) => {
  return (
    <div>
      <DialogPopover
        {...args}
        trigger={<Button onClick={() => null}>Open menu on the left side</Button>}
        primaryButton={{
          text: 'Action1',
        }}
      >
        <Text as="span" variant="t200">
          Example text
        </Text>
        <Text as="span" variant="t200">
          Example text
        </Text>
        <Text as="span" variant="t200">
          Example text
        </Text>
        <Text as="span" variant="t200">
          Example text
        </Text>
        <Text as="span" variant="t200">
          Example text
        </Text>
        <Text as="span" variant="t200">
          Example text
        </Text>
        <Text as="span" variant="t200">
          Example text
        </Text>
      </DialogPopover>
    </div>
  )
}

export const Regular = Template.bind({})
Regular.args = {
  secondaryButton: {
    text: 'Action2',
  },
}

export const SingleButton = Template.bind({})
