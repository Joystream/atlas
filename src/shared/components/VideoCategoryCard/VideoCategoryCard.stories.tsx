import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import React from 'react'

import { VideoCategoryCard, VideoCategoryCardProps } from './VideoCategoryCard'

export default {
  title: 'Shared/V/VideoCategoryCard',
  argTypes: {
    color: { defaultValue: '#D92E61' },
    variant: { defaultValue: 'default' },
  },
  component: VideoCategoryCard,
} as Meta

const Template: Story<VideoCategoryCardProps> = (args) => {
  return (
    <Container>
      <VideoCategoryCard {...args}>VideoCategoryCard</VideoCategoryCard>
    </Container>
  )
}
export const Default = Template.bind({})
Default.args = {}

export const Compact = Template.bind({})
Compact.args = {
  variant: 'compact',
}

const Container = styled.div`
  width: 414px;
`
