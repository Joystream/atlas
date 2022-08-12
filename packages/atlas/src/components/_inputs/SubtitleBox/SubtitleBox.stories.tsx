import { Meta, Story } from '@storybook/react'

import { SubtitleBox, SubtitleBoxProps } from './SubtitleBox'

export default {
  title: 'inputs/SubtitleBox',
  component: SubtitleBox,
  args: {
    language: 'Spanish',
    subtitles: '[Spanish] How_to_peel_potatoes.srt ',
  },
} as Meta<SubtitleBoxProps>

const Template: Story<SubtitleBoxProps> = (args) => <SubtitleBox {...args} />

export const Default = Template.bind({})
