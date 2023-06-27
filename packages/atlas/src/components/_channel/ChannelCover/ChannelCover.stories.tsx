import { Meta, StoryFn } from '@storybook/react'

import { ChannelCover, ChannelCoverProps } from './ChannelCover'

export default {
  title: 'channel/ChannelCover',
  component: ChannelCover,
  argTypes: {
    editable: { table: { required: false } },
  },
  args: {
    assetUrls: ['https://eu-central-1.linodeobjects.com/atlas-assets/channel-posters/2.jpg'],
  },
} as Meta<ChannelCoverProps>

const Template: StoryFn<ChannelCoverProps> = (args) => {
  return (
    <>
      <ChannelCover {...args} />
      <h3>The content will show up here</h3>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum consequuntur, consequatur in eaque ipsum labore
        perferendis quisquam voluptates, rerum quaerat quis sed velit incidunt unde assumenda facere fugit. Sit, cum?
      </p>
    </>
  )
}

export const Default = Template.bind({})

export const WithNoImage = Template.bind({})
WithNoImage.args = {
  assetUrls: undefined,
}
