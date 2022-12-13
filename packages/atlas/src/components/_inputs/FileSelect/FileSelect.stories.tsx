import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { ConfirmationModalProvider } from '@/providers/confirmationModal'

import { FileSelect, FileSelectProps } from './FileSelect'

export default {
  title: 'inputs/FileSelect',
  component: FileSelect,
  args: {
    title: 'Select file',
    type: 'video-thumbnail',
  },
  decorators: [
    (Story) => (
      <ConfirmationModalProvider>
        <Story />
      </ConfirmationModalProvider>
    ),
  ],
} as Meta<FileSelectProps>

const Template: StoryFn<FileSelectProps> = (args) => {
  const [file, setFile] = useState<File>()
  return (
    <>
      <FileSelect {...args} file={file} onUploadFile={(file) => setFile(file)} />
      <p>{file ? 'File' : 'No uploaded file'}</p>
      {file && (
        <ul>
          <li>name: {file.name}</li>
          <li>size: {file.size}</li>
          <li>type: {file.type}</li>
          <li>lastModified: {file?.lastModified}</li>
        </ul>
      )}
    </>
  )
}

export const playlist = Template.bind({})
playlist.args = {
  type: 'playlist-thumbnail',
}

export const VideoThumbnail = Template.bind({})
VideoThumbnail.args = {
  type: 'video-thumbnail',
}

export const VideoFile = Template.bind({})
VideoFile.args = {
  type: 'video-file',
}
