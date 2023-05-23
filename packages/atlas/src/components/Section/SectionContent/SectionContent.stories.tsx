import styled from '@emotion/styled'
import { Meta, StoryFn } from '@storybook/react'

import { SectionContent, SectionContentProps } from '@/components/Section/SectionContent'

export default {
  title: 'other/SectionContent',
  component: SectionContent,
} as Meta<SectionContentProps>

const Template: StoryFn<SectionContentProps> = (args: SectionContentProps) => {
  return (
    <SectionContent {...args}>
      <PlaceholderBox />
      <PlaceholderBox />
      <PlaceholderBox />
      <PlaceholderBox />
      <PlaceholderBox />
    </SectionContent>
  )
}

export const Grid = Template.bind({})
Grid.args = {
  type: 'grid',
}

export const Carousel = Template.bind({})
Carousel.args = {
  type: 'carousel',
  slidesPerView: 3,
}

const PlaceholderContainer = styled.div`
  padding: 30px;
  background: rgb(123 97 255 / 0.1);
  border: 2px dashed #7b61ff;
  color: #7b61ff;
  text-align: center;
`

const PlaceholderBox = () => (
  <PlaceholderContainer>
    This is a placeholder. <br /> In Figma, swap this with a local component that holds your content.
  </PlaceholderContainer>
)
