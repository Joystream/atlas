import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'

import { tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { sizes } from '@/styles'

import { Fee, FeeProps } from './Fee'

export default {
  title: 'other/Fee',
  component: Fee,
  argTypes: {
    className: { table: { disable: true } },
    variant: { table: { disable: true } },
    color: { table: { disable: true } },
    amount: { table: { disable: true } },
  },
  args: {
    variant: 'h500',
    amountToken: 0,
    loading: false,
    hideOnMobile: false,
  },
} as Meta<FeeProps>

const Template: Story<FeeProps & { amountToken: number }> = (args) => (
  <Wrapper>
    <Fee {...args} amount={tokenNumberToHapiBn(args.amountToken)} />
  </Wrapper>
)

export const Default = Template.bind({})

const Wrapper = styled.div`
  padding: ${sizes(20)};
`
