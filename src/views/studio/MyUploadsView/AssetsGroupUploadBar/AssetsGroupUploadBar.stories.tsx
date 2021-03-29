import { Meta, Story } from '@storybook/react'
import AssetsGroupBarUpload, { AssetsGroupBarUploadProps } from './AssetsGroupUploadBar'
import React from 'react'

export default {
  title: 'General/AssetsGroupBarUpload',
  component: AssetsGroupBarUpload,
  argTypes: {
    uploadData: {
      defaultValue: {
        type: 'channel',
        files: [
          {
            id: '768dad7c-6fea-4496-ae90-3a1ee4281bd4',
            type: 'avatar',
            progress: 0,
            width: 360,
            height: 420,
            size: 178400,
            status: 'reconnecting',
          },
          {
            id: '0c2672ff-8d19-43df-975f-5c089aed5dde',
            type: 'cover',
            progress: 100,
            width: 1300,
            height: 230,
            size: 500400,
            status: 'completed',
          },
          {
            id: 'f93c9f18-32e4-4e5e-8076-92a90bd5d2b2',
            type: 'video',
            progress: 0,
            width: 1920,
            height: 1080,
            size: 3735993000,
            status: 'pending',
          },
          {
            id: 'eae3c720-de6c-4434-82ef-02629f052074',
            type: 'video',
            progress: 70,
            width: 1920,
            height: 1080,
            size: 1735993000,
            status: 'uploading',
          },
        ],
      },
    },
  },
} as Meta

const Template: Story<AssetsGroupBarUploadProps> = (args) => <AssetsGroupBarUpload {...args} />

export const Default = Template.bind({})
