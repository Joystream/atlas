import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import { add } from 'date-fns'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { NFTDetails, NFTDetailsProps } from '.'

export default {
  title: 'NFT/NFTDetails',
  component: NFTDetails,
  argTypes: {
    size: {
      control: { type: 'select', options: ['small', 'medium'] },
    },
  },
  args: {
    ownerHandle: 'ye 🖤',
    ownerAvatarUri: 'https://54.172.37.177.nip.io/distributor-1/api/v1/assets/3',
    endingDate: add(new Date(), {
      minutes: 110,
      seconds: 10,
    }),
    auction: 'none',
    size: 'medium',
    buyNowPrice: 36900,
    lastTransactionDate: new Date(),
    lastPrice: 25900,
  },
  decorators: [
    (Story) => {
      return (
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      )
    },
  ],
} as Meta

const Template: Story<NFTDetailsProps & { size: 'medium' | 'small' }> = (args) => (
  <Container data-size={args.size}>
    <NFTDetails {...args} />
  </Container>
)

export const Default = Template.bind({})

const Container = styled.div<{ 'data-size': 'medium' | 'small' }>`
  width: 420px;

  &[data-size='small'] {
    width: 279px;
  }
`
