import { Meta, StoryFn } from '@storybook/react'

import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { CrtBasicInfoWidget, CrtBasicInfoWidgetProps } from '@/components/_crt/CrtBasicInfoWidget/CrtBasicInfoWidget'
import { JoystreamProvider } from '@/providers/joystream/joystream.provider'

export default {
  title: 'crt/CrtBasicInfoWidget',
  component: CrtBasicInfoWidget,
  decorators: [
    (Story) => (
      <JoystreamProvider>
        <Story />
      </JoystreamProvider>
    ),
  ],
} as Meta<CrtBasicInfoWidgetProps>

const Template: StoryFn<CrtBasicInfoWidgetProps> = (args) => <CrtBasicInfoWidget {...args} />

export const Default = Template.bind({})
Default.args = {
  name: 'CRT',
  details: [
    {
      caption: 'TOTAL REV.',
      content: 65656,
      icon: <JoyTokenIcon size={16} variant="silver" />,
      tooltipText: 'Lorem ipsum',
    },
    {
      caption: 'REV. SHARE',
      content: '80%',
      icon: <JoyTokenIcon size={16} variant="silver" />,
      tooltipText: 'Lorem ipsum',
    },
    {
      caption: 'AN. REWARD',
      content: '20%',
      icon: <JoyTokenIcon size={16} variant="silver" />,
      tooltipText: 'Lorem ipsum',
    },
  ],
}
