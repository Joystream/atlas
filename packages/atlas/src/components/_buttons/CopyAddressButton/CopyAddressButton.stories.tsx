import { Meta, Story } from '@storybook/react'

import { Snackbars } from '@/providers/snackbars'

import { CopyAddressButton, CopyAddressButtonProps } from './CopyAddressButton'

export default {
  title: 'button/CopyAddressButton',
  component: CopyAddressButton,
  args: {
    address: 'j4SF97snTr6v6wxgUyCMTwFZL3RBrBaLqqp1qAh9MasZPxA3c',
  },
  argTypes: {
    size: {
      control: { type: 'select', options: ['big', 'small'] },
    },
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Snackbars />
      </>
    ),
  ],
} as Meta<CopyAddressButtonProps>

const Template: Story<CopyAddressButtonProps> = (args) => {
  return <CopyAddressButton {...args} />
}
export const Default = Template.bind({})
