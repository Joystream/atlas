import { Meta, StoryFn } from '@storybook/react'

import { Section, SectionProps } from './Section'

export default {
  title: 'other/Section',
  component: Section,
} as Meta

const DefaultTemplate: StoryFn<SectionProps> = (args) => {
  return <Section {...args} />
}

export const Default = DefaultTemplate.bind({})
