import { Meta, Story } from '@storybook/react'
import React from 'react'

import { PopoverDialog } from './PopoverDialog'

import { Button } from '../Button'
import { Text } from '../Text'

export default {
  title: 'Shared/P/PopoverDialog',
  component: PopoverDialog,
  args: {
    header: "I'm a title",
    dividers: false,
  },
} as Meta

const Template: Story = (args) => {
  return (
    <>
      <div>
        <PopoverDialog
          {...args}
          content={
            <>
              <Text>Example text</Text>
              <Text>Example text</Text>
              <Text>Example text</Text>
              <Text>Example text</Text>
              <Text>Example text</Text>
              <Text>Example text</Text>
              <Text>Example text</Text>
            </>
          }
          footer={
            <>
              <Button variant="secondary">Action1</Button>
              <Button>Action1</Button>
            </>
          }
        >
          <Button onClick={() => null}>Open menu on the left side</Button>
        </PopoverDialog>
      </div>
    </>
  )
}

export const Regular = Template.bind({})
