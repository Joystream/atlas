import { OverlayManagerProvider } from '@/hooks'
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import MultiFileSelect, { MultiFileSelectProps, FileState } from './MultiFileSelect'

export default {
  title: 'Shared/MultiFileSelect',
  component: MultiFileSelect,
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta

const Template: Story<MultiFileSelectProps> = (args) => {
  const [files, setFiles] = useState<FileState>({
    video: null,
    image: null,
  })
  const [croppedImageUrl, setCroppedImageUrl] = useState('')

  return (
    <MultiFileSelect
      {...args}
      files={files}
      onChangeFiles={setFiles}
      croppedImageUrl={croppedImageUrl}
      onCropImage={setCroppedImageUrl}
    />
  )
}

export const Default = Template.bind({})
