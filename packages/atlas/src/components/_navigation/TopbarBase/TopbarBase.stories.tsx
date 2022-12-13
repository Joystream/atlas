import { Meta, StoryFn } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { TopbarBase, TopbarBaseProps } from './TopbarBase'

export default {
  title: 'navigation/TopbarBase',
  component: TopbarBase,
  args: {
    logoLinkUrl: 'http://localhost:6006',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} as Meta<TopbarBaseProps>

const RegularTemplate: StoryFn<TopbarBaseProps> = (args) => {
  return <TopbarBase {...args} fullLogoNode={<>logo</>} />
}

export const Regular = RegularTemplate.bind({})
