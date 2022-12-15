import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { OverlayManagerProvider } from '@/providers/overlayManager'

import { InputFilesState, MultiFileSelect, MultiFileSelectProps } from './MultiFileSelect'

export default {
  title: 'inputs/MultiFileSelect',
  component: MultiFileSelect,
  decorators: [
    (Story) => (
      <ConfirmationModalProvider>
        <OverlayManagerProvider>
          <Story />
        </OverlayManagerProvider>
      </ConfirmationModalProvider>
    ),
  ],
} as Meta

const Template: StoryFn<MultiFileSelectProps> = (args) => {
  const [files, setFiles] = useState<InputFilesState>({
    video: null,
    thumbnail: null,
  })

  return (
    <MultiFileSelect
      {...args}
      files={files}
      onThumbnailChange={(thumbnail) => setFiles((files) => ({ ...files, thumbnail }))}
      onVideoChange={(video) => setFiles((files) => ({ ...files, video }))}
    />
  )
}

export const Default = Template.bind({})
