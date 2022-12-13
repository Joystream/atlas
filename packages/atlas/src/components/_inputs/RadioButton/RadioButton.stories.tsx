import { Meta, StoryFn } from '@storybook/react'

import { RadioButton, RadioButtonProps } from './RadioButton'

export default {
  title: 'inputs/RadioButton',
  component: RadioButton,
  argTypes: {
    selectedValue: { table: { disable: true } },
  },
  args: {
    label: 'Hello there',
    caption: 't100',
    disabled: false,
    error: false,
    selected: false,
  },
} as Meta<RadioButtonProps>

const Template: StoryFn = (args) => {
  return <RadioButton {...args} name="radio-group" value="1" selectedValue={args.selected ? '1' : undefined} />
}

export const Default = Template.bind({})
