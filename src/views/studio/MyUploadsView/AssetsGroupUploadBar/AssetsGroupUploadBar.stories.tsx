import React from 'react'
import { Meta, Story } from '@storybook/react'
import AssetsGroupUploadBar, { AssetsGroupBarUploadProps } from './AssetsGroupUploadBar'
import { LiaisonJudgement } from '@/api/queries/__generated__/baseTypes.generated'

export default {
  title: 'General/AssetsGroupUploadBar',
  component: AssetsGroupUploadBar,
  argTypes: {
    uploadData: {
      defaultValue: [
        {
          id: '768dad7c-6fea-4496-ae90-3a1ee4281bd4',
          type: 'avatar',
          progress: 100,
          size: 178400,
          imageCropData: {
            top: 0,
            left: 0,
            width: 360,
            height: 420,
          },
          parentObject: {
            type: 'channel',
            id: '1',
          },
          lastStatus: 'completed',
          liaisonJudgement: LiaisonJudgement.Accepted,
        },
        {
          id: '0c2672ff-8d19-43df-975f-5c089aed5dde',
          type: 'cover',
          progress: 60,
          imageCropData: {
            top: 0,
            left: 0,
            width: 1300,
            height: 230,
          },
          size: 500400,
          parentObject: {
            type: 'channel',
            id: '1',
          },
          lastStatus: 'inProgress',
          liaisonJudgement: LiaisonJudgement.Accepted,
        },
      ],
    },
  },
} as Meta

const Template: Story<AssetsGroupBarUploadProps> = (args) => <AssetsGroupUploadBar {...args} />

export const Default = Template.bind({})
