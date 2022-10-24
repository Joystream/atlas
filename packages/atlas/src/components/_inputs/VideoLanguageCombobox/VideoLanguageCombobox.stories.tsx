import { Meta, Story } from '@storybook/react'

import { VideoLanguageCombobox, VideoLanguageComboboxProps } from './VideoLanguageCombobox'

export default {
  title: 'inputs/VideoLanguageCombobox',
  component: VideoLanguageCombobox,
  args: {
    onSelectedItemChange: () => null,
  },
} as Meta<VideoLanguageComboboxProps>

const Template: Story<VideoLanguageComboboxProps> = (args) => <VideoLanguageCombobox {...args} />

export const Default = Template.bind({})
