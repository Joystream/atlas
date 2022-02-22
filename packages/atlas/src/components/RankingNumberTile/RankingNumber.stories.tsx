import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { media } from '@/styles'

import { RankingNumberTile } from './RankingNumberTile'

export default {
  title: 'other/RankingNumberTile',
  component: RankingNumberTile,
  argTypes: {
    doubleDigits: {
      control: { type: 'select', options: [true, false] },
    },
    rankingNumber: { control: { type: 'number' } },
  },
} as Meta

const PlaceHolder = styled.div`
  background-color: grey;
  width: 280px;
  height: 256px;
`

/*
  argTypes: {
    iconType: {
      control: { type: 'select', options: [null, 'error', 'success', 'info', 'warning'] },
    },
    timeout: { control: { type: 'number' } },
  },
  args: {
    title: 'Lorem ipsul dolor',
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo, veniam assumenda!',
    actionText: 'Action',
    timeout: null,
  },
  decorators: [
    (Story) => (
      <>
        <BrowserRouter>
          <Story />
          <Snackbars />
        </BrowserRouter>
      </>
    ),
  ],
  */

const RankingNumberTemplate: Story<{ doubleDigits: boolean; rankingNumber: number }> = ({
  doubleDigits = false,
  rankingNumber,
}) => {
  console.log('rankingNumber', rankingNumber)
  return (
    <RankingNumberTile rankingNumber={rankingNumber} doubleDigits={doubleDigits}>
      <PlaceHolder />
    </RankingNumberTile>
  )
}

export const RankingNumber = RankingNumberTemplate.bind({})
