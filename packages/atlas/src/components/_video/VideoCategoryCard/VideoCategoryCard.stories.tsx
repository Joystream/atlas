import styled from '@emotion/styled'
import { Meta, StoryFn } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { SvgCategoriesAutosAndVehicles } from '@/assets/icons'

import { VideoCategoryCard, VideoCategoryCardProps } from './VideoCategoryCard'

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

const Container = styled.div`
  width: 414px;
`
