import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import React from 'react'

import { colors } from '@/shared/theme'

import { VideoCategoryCard, VideoCategoryCardProps } from './VideoCategoryCard'

export default {
  title: 'Shared/V/VideoCategoryCard',
  component: VideoCategoryCard,
} as Meta

const Template: Story<VideoCategoryCardProps> = (args) => {
  return (
    <Container>
      <VideoCategoryCard {...args}>VideoCategoryCard</VideoCategoryCard>
    </Container>
  )
}
export const Regular = Template.bind({})
Regular.args = {}

export const Container = styled.div`
  width: 414px;
`
