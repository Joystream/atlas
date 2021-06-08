import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import React from 'react'

import { colors } from '@/shared/theme'

import Carousel, { CarouselProps } from './Carousel'

export default {
  title: 'Shared/C/Carousel',
  component: Carousel,
} as Meta

const Template: Story<CarouselProps> = (args) => {
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
  itemWidth: 300,
  slidesToShow: 3,
  slidesToScroll: 1,
}
export const Draggable = Template.bind({})
Draggable.args = {
  draggable: true,
  itemWidth: 300,
  slidesToShow: 3,
  slidesToScroll: 1,
}

const CarouselItem = styled.div`
  width: 300px;
  min-height: 200px;
  text-align: center;
  color: ${colors.white};
  background-color: ${colors.gray['300']};
  display: flex;
  align-items: center;
  justify-content: center;
  :not(:last-child) {
    margin-right: 12px;
  }
`
