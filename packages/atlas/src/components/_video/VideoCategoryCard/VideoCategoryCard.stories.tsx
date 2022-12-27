import styled from '@emotion/styled'
import { Meta, StoryFn } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { SvgCategoriesAutosAndVehicles } from '@/assets/icons'

import { VideoCategoryCard, VideoCategoryCardProps } from './VideoCategoryCard'

import { FeaturedVideoCategoryCard } from '.'

export default {
  title: 'video/VideoCategoryCard',
  args: {
    color: '#D92E61',
    variant: 'default',
    categoryVideosCount: 70,
    coverImg: 'https://placedog.net/360/203',
    videosTotalCount: 300,
    icon: <SvgCategoriesAutosAndVehicles />,
    title: 'Category',
  },
  argTypes: {
    color: { control: { type: 'color' } },
    icon: { table: { disable: true } },
  },
  component: VideoCategoryCard,
  decorators: [
    (Story) => {
      return (
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      )
    },
  ],
} as Meta<VideoCategoryCardProps>

const Template: StoryFn<VideoCategoryCardProps> = (args) => {
  return (
    <Container>
      <VideoCategoryCard {...args}>VideoCategoryCard</VideoCategoryCard>
    </Container>
  )
}
export const Default = Template.bind({})
Default.args = {}

const TemplateFeatured: StoryFn<VideoCategoryCardProps> = (args) => {
  return (
    <Container2>
      <FeaturedVideoCategoryCard
        videoUrl="https://sumer-dev-2.joystream.app/storage/asset/v0/5Fbef6KfEP3ncHxroVsdWQF6gLb8ph47dcAmzWptjuMMWHnP"
        videoTitle="Anderson .Paak and The Free Nationals"
        {...args}
      >
        VideoCategoryCard
      </FeaturedVideoCategoryCard>
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
