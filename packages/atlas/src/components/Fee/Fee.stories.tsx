import styled from '@emotion/styled'
import { Meta, StoryFn } from '@storybook/react'

import { tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { sizes } from '@/styles'

import { Fee, FeeProps } from './Fee'

export default {
  title: 'other/Fee',
  component: Fee,
  args: {
    variant: 'h500',
  },
} as Meta<FeeProps>

const Template: StoryFn<FeeProps & { amountToken: number }> = (args) => (
  <Wrapper>
    <Fee {...args} amount={tokenNumberToHapiBn(args.amountToken)} />
  </Wrapper>
)

export const Default = Template.bind({})

const Wrapper = styled.div`
  padding: ${sizes(20)};
`
