import { Meta, Story } from '@storybook/react'
import { useState } from 'react'

import { Setting, Settings, SettingsProps } from './Settings'

export default {
  title: 'video/Settings',
  component: Settings,
} as Meta<SettingsProps>

const Template: Story<SettingsProps> = (args) => {
  const [quality, setQuality] = useState<number | string>(320)
  const [speed, setSpeed] = useState<number | string>(1.5)

  const availableSpeeds = [2, 1.5, 1.25, 1, 0.5, 0.25]
  const availableQualities = [1440, 1080, 720, 480, 320, 240]

  const settings: Setting[] = [
    {
      label: 'Speed',
      value: `Normal (${speed}x) speed`,
      options: availableSpeeds.map((s) => ({
        checked: speed === s,
        onSettingClick: (opt) => setSpeed(opt.value),
        value: s,
        label: `${s}x`,
      })),
    },
    {
      label: 'Quality',
      value: `${quality}p`,
      options: availableQualities.map((q) => ({
        checked: q === quality,
        label: `${q}p`,
        value: q,
        onSettingClick: (opt) => setQuality(opt.value),
      })),
    },
  ]
  return (
    <>
      <Settings {...args} settings={settings} />
    </>
  )
}

export const Default = Template.bind({})
