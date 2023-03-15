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
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/*@ts-ignore*/}
      {() => Array.from({ length: 10 }, (_, i) => <CarouselItem key={i}> Carousel Item {i}</CarouselItem>)}
    </Carousel>
  )
}
export const Regular = Template.bind({})
Regular.args = {
  perView: 3,
  bound: true,
}

export const WithDots = Template.bind({})
WithDots.args = {
  perView: 3,
  dotsVisible: true,
  bound: true,
}

const CarouselItem = styled.div`
  width: 300px;
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
