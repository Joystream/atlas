import { Meta, StoryFn } from '@storybook/react'

import { NonLinearProgressWidget, NonLinearProgressWidgetProps } from '@/components/NonLinearProgressWidget'
import { Text } from '@/components/Text'

import { Button, TextButton } from '../_buttons/Button'

export default {
  title: 'CRT/NonLinearProgressWidget',
  component: NonLinearProgressWidget,
} as Meta<NonLinearProgressWidgetProps>

const steps: NonLinearProgressWidgetProps['steps'] = [
  {
    title: 'Create token',
    description: 'Create own token and share it with your viewers!',
  },
  {
    title: 'Share the good news',
    description: 'Share base information about your token with your viewers',
  },
  {
    title: 'Take your profits',
    description: 'Visit dashboard and withdraw first revenue from your token',
  },
]

const Template: StoryFn<NonLinearProgressWidgetProps> = (args) => <NonLinearProgressWidget {...args} />

export const Default = Template.bind({})
Default.args = {
  activeStep: 2,
  steps,
  renderCurrentStepActionButton: (step) => <Button>This is action button for step {step}</Button>,
  goalComponent: (
    <Text variant="t200" as="p">
      Complete 1 more step to achieve <TextButton>Token master</TextButton>
    </Text>
  ),
}
