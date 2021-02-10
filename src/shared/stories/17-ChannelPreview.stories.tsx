import React from 'react'
import { ChannelPreviewBase } from '../components'
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs'

export default {
  title: 'ChannelPreviewBase',
  component: ChannelPreviewBase,
  decorators: [withKnobs],
}

export const Primary = () => {
  return (
    <ChannelPreviewBase
      handle={text('Channel name', 'Test channel')}
      videoCount={number('Channel uploads', 123456)}
      avatarUrl={text('Channel avatar URL', 'https://source.unsplash.com/collection/781477/320x320')}
    />
  )
}

export const Placeholder = () => {
  return <ChannelPreviewBase />
}
