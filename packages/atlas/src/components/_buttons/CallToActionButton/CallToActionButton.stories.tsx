import { Meta, StoryFn } from '@storybook/react'

import { SvgSidebarPopular } from '@/assets/icons'

import { CallToActionButton, CallToActionButtonProps, CallToActionWrapper } from '.'

export default {
  title: 'button/CallToActionButton',
  component: CallToActionButton,
} as Meta

const Template: StoryFn<CallToActionButtonProps> = (args) => {
  return (
    <CallToActionWrapper itemsCount={1}>
      <CallToActionButton {...args} />
    </CallToActionWrapper>
  )
}
export const Default = Template.bind({})
Default.args = {
  label: 'Call To Action Button',
  icon: <SvgSidebarPopular />,
}
