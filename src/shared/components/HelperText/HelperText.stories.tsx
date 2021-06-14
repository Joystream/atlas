import { Meta, Story } from '@storybook/react'
import React from 'react'

import { HelperTextProps, HelperText } from './HelperText'

export default {
  title: 'Shared/H/HelperText',
  component: HelperText,
  argTypes: {
    helperText: { defaultValue: 'some helper text' },
  },
} as Meta

const Template: Story<HelperTextProps> = (args) => <HelperText {...args} />

export const Default = Template.bind({})
