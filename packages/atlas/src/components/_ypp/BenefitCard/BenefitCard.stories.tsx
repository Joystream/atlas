import styled from '@emotion/styled'
import { Meta, StoryFn } from '@storybook/react'

import { BenefitCard, BenefitCardProps } from './BenefitCard'

export default {
  title: 'ypp/BenefitCard',
  component: BenefitCard,
  argTypes: {
    variant: { control: { type: 'radio', options: ['full', 'compact'] } },
  },
  args: {
    title: 'Share Atlas video on YouTube',
    description: 'To share Atlas video you need to first upload your own video to the platform.',
    dollarAmount: 69,
  },
} as Meta<BenefitCardProps>

const Template: StoryFn<BenefitCardProps> = (args) => (
  <Wrapper>
    <BenefitCard {...args} /> <BenefitCard {...args} /> <BenefitCard {...args} /> <BenefitCard {...args} />{' '}
    <BenefitCard {...args} />
  </Wrapper>
)

const Wrapper = styled.div`
  display: grid;
  gap: 24px;
`

export const Default = Template.bind({})
