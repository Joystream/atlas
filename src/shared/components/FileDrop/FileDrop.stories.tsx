import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import FileDrop, { FileDropProps } from './FileDrop'

export default {
  title: 'Shared/FileDrop',
  component: FileDrop,
  argTypes: {
    step: {
      defaultValue: 'video',
    },
    icon: {
      defaultValue: 'video-dnd',
    },
    title: {
      defaultValue: 'Select Video File',
    },
    paragraph: {
      defaultValue: '16:9 Ratio preferred. 4K, 1440p, 1080p or 720p. This is example FPO data only.',
    },
  },
} as Meta

const Template: Story<FileDropProps> = (args) => {
  const [videofile, setVideoFile] = useState<null | File>(null)
  return (
    <>
      <FileDrop {...args} onUploadFile={(file) => setVideoFile(file)} />
      <p>{videofile ? 'File' : 'No uploaded file'}</p>
      {videofile && (
        <ul>
          <li>name: {videofile.name}</li>
          <li>size: {videofile.size}</li>
          <li>type: {videofile.type}</li>
          <li>lastModified: {videofile?.lastModified}</li>
        </ul>
      )}
    </>
  )
}

export const Default = Template.bind({})
