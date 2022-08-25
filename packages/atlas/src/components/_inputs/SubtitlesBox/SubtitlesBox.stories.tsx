import { Meta, Story } from '@storybook/react'

import { SubtitleBoxProps, SubtitlesBox } from './SubtitlesBox'

export default {
  title: 'inputs/SubtitlesBox',
  component: SubtitlesBox,
  args: {
    languageIso: 'Spanish',
    subtitles: '[Spanish] How_to_peel_potatoes.srt ',
  },
} as Meta<SubtitleBoxProps>

const Template: Story<SubtitleBoxProps> = (args) => <SubtitlesBox {...args} />

export const Default = Template.bind({})
