import styled from '@emotion/styled'
import { Meta, StoryFn } from '@storybook/react'

import { cVar } from '@/styles'

import { Carousel, CarouselProps } from './Carousel'

export default {
  title: 'other/Carousel',
  component: Carousel,
} as Meta

const Template: StoryFn<CarouselProps> = (args) => {
  return (
    <Carousel {...args}>
      {Array.from({ length: 10 }, (_, i) => (
        <CarouselItem key={i}> Carousel Item {i}</CarouselItem>
      ))}
    </Carousel>
  )
}
export const Regular = Template.bind({})
Regular.args = {
  slidesPerView: 3,
  slidesPerGroup: 3,
  rewind: true,
}

export const WithDots = Template.bind({})
WithDots.args = {
  slidesPerView: 3,
  slidesPerGroup: 3,
  rewind: true,
  navigation: true,
  dotsVisible: true,
}

const CarouselItem = styled.div`
  min-height: 200px;
  text-align: center;
  color: ${cVar('colorCoreBaseWhite')};
  background-color: ${cVar('colorCoreNeutral300')};
  display: flex;
  align-items: center;
  justify-content: center;

  :not(:last-child) {
    margin-right: 12px;
  }
`
