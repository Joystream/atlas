import { Meta, Story } from '@storybook/react'

import { SvgJoyTokenMonochrome24 } from '@/assets/icons'

import { WidgetTile, WidgetTileProps } from './WidgetTile'

export default {
  title: 'other/WidgetTile',
  component: WidgetTile,
  args: {
    loading: false,
    title: 'Label',
    text: 'Text',
    caption: '$0.00',
    button: {
      text: 'Placeholder',
      fullWidth: true,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '360px' }}>
        <Story />
      </div>
    ),
  ],
} as Meta<WidgetTileProps>

const Template: Story<WidgetTileProps> = (args) => <WidgetTile {...args} />

export const Default = Template.bind({})

export const WithIcon = Template.bind({})
WithIcon.args = {
  icon: <SvgJoyTokenMonochrome24 />,
}

export const WithInformation = Template.bind({})
WithInformation.args = {
  tooltip: {
    headerText: 'Lorem Ipsum',
    text: 'This is tooltip',
  },
}
