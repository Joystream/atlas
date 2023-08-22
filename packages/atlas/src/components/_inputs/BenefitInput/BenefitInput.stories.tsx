import { Meta, StoryFn } from '@storybook/react'

import { BenefitInput, BenefitInputProps } from './BenefitInput'

export default {
  title: 'inputs/BenefitInput',
  component: BenefitInput,
} as Meta<BenefitInputProps>

const Template: StoryFn<BenefitInputProps> = (args: BenefitInputProps) => <BenefitInput {...args} />

export const Default = Template.bind({})
Default.bind({
  onMoveUp: () => undefined,
  onMoveDown: () => undefined,
  onRemove: () => undefined,
  position: 'middle',
})
