import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import React from 'react'

import { VideoCategoryCard, VideoCategoryCardProps } from './VideoCategoryCard'

import { FeaturedVideoCategoryCard } from '.'

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

const TemplateFeatured: Story<VideoCategoryCardProps> = (args) => {
  return (
    <Container2>
      <FeaturedVideoCategoryCard {...args}>VideoCategoryCard</FeaturedVideoCategoryCard>
    </Container2>
  )
}
export const Featured = TemplateFeatured.bind({})
Featured.args = {}

const Container = styled.div`
  width: 414px;
`

const Container2 = styled.div`
  width: 636px;
`
