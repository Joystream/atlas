import { OverlayManagerProvider } from '@/hooks'
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import MultiFileSelect, { MultiFileSelectProps, InputFilesState } from './MultiFileSelect'

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
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<InputFilesState>({
    video: null,
    thumbnail: null,
  })

  return (
    <MultiFileSelect
      {...args}
      files={files}
      error={error}
      onError={setError}
      onThumbnailChange={(thumbnail) => setFiles((files) => ({ ...files, thumbnail }))}
      onVideoChange={(video) => setFiles((files) => ({ ...files, video }))}
    />
  )
}

export const Default = Template.bind({})
