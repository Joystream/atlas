import { Meta } from '@storybook/react'

import { BenefitInput } from './BenefitInput'

export default {
  title: 'inputs/BenefitInput',
  component: BenefitInput,
} as Meta

const Template = () => <BenefitInput />

export const Default = Template.bind({})
