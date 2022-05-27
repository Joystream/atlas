import { Meta, Story } from '@storybook/react'

import { HelperText, HelperTextProps } from './HelperText'

export default {
  title: 'inputs/HelperText',
  component: HelperText,
  argTypes: {
    helperText: { defaultValue: 'some helper text' },
  },
} as Meta

const Template: Story<HelperTextProps> = (args) => <HelperText {...args} />

export const Default = Template.bind({})
