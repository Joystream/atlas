import { Meta, StoryFn } from '@storybook/react'

import { ProgressWidget, ProgressWidgetProps } from '@/components/ProgressWidget/ProgressWidget'
import { Text } from '@/components/Text'

import { TextButton } from '../_buttons/Button'

export default {
  title: 'CRT/ProgressWidget',
  component: ProgressWidget,
} as Meta<ProgressWidgetProps>

const steps: ProgressWidgetProps['steps'] = [
  {
    title: 'Create token',
    description: 'Createn own token and share it with your viewers!',
    primaryButton: {
      text: 'Create token',
    },
  },
  {
    title: 'Share the good news',
    description: 'Share base information about your token with your viewers',
    primaryButton: {
      text: 'Share now',
    },
  },
  {
    title: 'Take your profits',
    description: 'Visit dashboard and withdraw first revenue from your token',
    primaryButton: {
      text: 'To the moon!',
    },
  },
]

const Template: StoryFn<ProgressWidgetProps> = (args) => <ProgressWidget {...args} />

export const Default = Template.bind({})
Default.args = {
  activeStep: 2,
  steps,
  goalComponent: (
    <Text variant="t200" as="p">
      Complete 1 more step to achive
      <TextButton>Token master</TextButton>
    </Text>
  ),
}
