import { Meta, StoryFn } from '@storybook/react'

import { Step, StepProps } from './Step'

export default {
  title: 'Other/Step',
  component: Step,
  args: {
    number: 1,
    title: 'Step title',
    variant: 'current',
  },
  argTypes: {
    variant: { controls: { type: 'select', options: ['current', 'future', 'completed'] } },
  },
} as Meta

const Template: StoryFn<StepProps> = (args) => <Step {...args} />

export const Default = Template.bind({})

export const File = Template.bind({})
File.args = {
  type: 'file',
}
