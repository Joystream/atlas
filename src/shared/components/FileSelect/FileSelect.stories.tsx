import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import FileSelect, { FileSelectProps } from './FileSelect'

export default {
  title: 'Shared/F/FileSelect',
  component: FileSelect,
  argTypes: {
    fileType: {
      defaultValue: 'video',
    },
    title: {
      defaultValue: 'Select Video File',
    },
    paragraph: {
      defaultValue: '16:9 Ratio preferred. 4K, 1440p, 1080p or 720p. This is example FPO data only.',
    },
  },
} as Meta

const Template: Story<FileSelectProps> = (args) => {
  const [videofile, setVideoFile] = useState<null | File>(null)
  return (
    <>
      <FileSelect {...args} onUploadFile={(file) => setVideoFile(file)} />
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
