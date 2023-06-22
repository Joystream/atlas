import { Meta, StoryFn } from '@storybook/react'

import { OverlayManagerProvider } from '@/providers/overlayManager'

import { CollectorsBox, CollectorsBoxProps } from './'

import { ChannelCover } from '../ChannelCover'

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
    maxShowedCollectors: 5,
  },
  argTypes: {
    collectors: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta

const Template: StoryFn<CollectorsBoxProps> = (args) => <CollectorsBox {...args} />

export const Default = Template.bind({})
export const WithLessThan5Collectors = Template.bind({})
WithLessThan5Collectors.args = {
  collectors: [
    { urls: ['https://thispersondoesnotexist.com/image'], tooltipText: 'William', nftsAmount: 6 },
    {
      urls: ['https://eu-central-1.linodeobjects.com/atlas-assets/channel-posters/2.jpg'],
      tooltipText: 'Someone',
      nftsAmount: 1,
    },
    { urls: ['https://thispersondoesnotexist.com/image'], tooltipText: 'Someone else', nftsAmount: 7 },
  ],
}

const TemplateWithChannelCover: StoryFn<CollectorsBoxProps> = (args) => (
  <div style={{ position: 'relative' }}>
    <ChannelCover assetUrl={['https://eu-central-1.linodeobjects.com/atlas-assets/channel-posters/2.jpg']} />
    <div style={{ position: 'absolute', bottom: -32, right: 0 }}>
      <CollectorsBox {...args} />
    </div>
  </div>
)

export const WithChannelCover = TemplateWithChannelCover.bind({})
