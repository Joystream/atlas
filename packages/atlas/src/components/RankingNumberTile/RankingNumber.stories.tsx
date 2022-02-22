import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import React from 'react'

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
  args: {
    rankingNumber: 1,
    doubleDigits: false,
  },
} as Meta

const PlaceHolder = styled.div`
  background-color: grey;
  width: 280px;
  height: 256px;
`

const RankingNumberTemplate: Story<{ doubleDigits: boolean; rankingNumber: number }> = ({
  doubleDigits = false,
  rankingNumber,
}) => {
  return (
    <RankingNumberTile rankingNumber={rankingNumber} doubleDigits={doubleDigits}>
      <PlaceHolder />
    </RankingNumberTile>
  )
}

export const RankingNumber = RankingNumberTemplate.bind({})
