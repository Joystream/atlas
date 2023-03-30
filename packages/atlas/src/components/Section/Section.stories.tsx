import { Meta } from '@storybook/react'

import { Section } from './Section'

export default {
  title: 'other/Section',
  component: Section,
} as Meta

const DefaultTemplate: StoryFn<SectionHeaderProps> = (args) => {
  return <Section {...args} />
}
