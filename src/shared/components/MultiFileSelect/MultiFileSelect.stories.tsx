import { OverlayManagerProvider } from '@/hooks'
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import { FileRejection } from 'react-dropzone'
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
  const [error, setError] = useState('')
  const [files, setFiles] = useState<FileState>({
    video: null,
    image: null,
  })
  const [croppedImageUrl, setCroppedImageUrl] = useState('')

  const handleFileRejections = (fileRejections: FileRejection[]) => {
    if (fileRejections.length) {
      const { errors } = fileRejections[0]
      const invalidType = errors.find((error) => error.code === 'file-invalid-type')
      const invalidSize = errors.find((error) => error.code === 'file-too-large')
      invalidSize && setError(invalidSize.message)
      invalidType && setError(invalidType.message)
    }
  }

  return (
    <MultiFileSelect
      {...args}
      files={files}
      error={error}
      onError={setError}
      onDropRejected={handleFileRejections}
      onChangeFiles={setFiles}
      croppedImageUrl={croppedImageUrl}
      onCropImage={setCroppedImageUrl}
    />
  )
}

export const Default = Template.bind({})
