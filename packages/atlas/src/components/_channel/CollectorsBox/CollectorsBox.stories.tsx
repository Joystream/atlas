import { Meta, Story } from '@storybook/react'
import React from 'react'

import { OverlayManagerProvider } from '@/providers/overlayManager'

import { CollectorsBox, CollectorsBoxProps } from './'

export default {
  title: 'channel/CollectorsBox',
  component: CollectorsBox,
  args: {
    collectors: [
      { assetUrl: 'https://thispersondoesnotexist.com/image', tooltipText: 'Jane', nftsAmount: 4 },
      {
        assetUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/channel-posters/2.jpg',
        tooltipText: 'John',
        nftsAmount: 2,
      },
      { assetUrl: 'https://thispersondoesnotexist.com/image', tooltipText: 'William', nftsAmount: 6 },
      {
        assetUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/channel-posters/2.jpg',
        tooltipText: 'Someone',
        nftsAmount: 1,
      },
      { assetUrl: 'https://thispersondoesnotexist.com/image', tooltipText: 'Someone else', nftsAmount: 7 },
    ],
  },
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta

const Template: Story<CollectorsBoxProps> = (args) => <CollectorsBox {...args} />

export const Default = Template.bind({})
