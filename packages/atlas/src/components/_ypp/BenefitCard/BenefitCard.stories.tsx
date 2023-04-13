import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'

import { Text } from '@/components/Text'

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
    steps: [
      <>
        Click{' '}
        <Text as="span" variant="t200" color="colorTextStrong">
          “Publish new video”
        </Text>{' '}
        button and proceed to video workspace
      </>,
      <>
        While publishing your new video make sure that all assets like thumbnail, video file, title, description are the{' '}
        <Text as="span" variant="t200" color="colorTextStrong">
          same as used previously on YouTube
        </Text>
      </>,
      <>
        After completing the upload -{' '}
        <Text as="span" variant="t200" color="colorTextStrong">
          contact your collabolator on discord
        </Text>
      </>,
      'Place the link in the video description',
    ],
    variant: 'full',
    actionButton: {
      text: 'Publish new video',
    },
    dollarAmount: {
      type: 'number',
      amount: 2.56,
    },
    joyAmount: {
      type: 'number',
      amount: 12356,
    },
  },
} as Meta<BenefitCardProps>

const Template: Story<BenefitCardProps> = (args) => (
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
