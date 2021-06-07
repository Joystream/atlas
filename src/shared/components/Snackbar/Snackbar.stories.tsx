import React from 'react'
import { Meta, Story } from '@storybook/react'
import Button from '../Button'
import { useSnackbar, Snackbars } from '@/hooks/useSnackbar/useSnackbar'

export default {
  title: 'Shared/S/Snackbar',
  component: Snackbars,
  argTypes: {
    title: { defaultValue: 'Lorem ipsul dolor', required: true },
    description: { defaultValue: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo, veniam assumenda!' },
    actionText: { defaultValue: 'Action' },
    variant: {
      control: { type: 'select', options: ['primary', 'secondary'] },
      defaultValue: 'secondary',
    },
    iconType: {
      control: { type: 'select', options: [null, 'error', 'success', 'info', 'warning'] },
      defaultValue: null,
    },
    timeout: { control: { type: 'number' }, defaultValue: null },
  },
  decorators: [
    (Story) => (
      <>
        <Story />
      </>
    ),
  ],
} as Meta

const ClickableTemplate: Story = ({ ...args }) => {
  const { displaySnackbar } = useSnackbar()
  return (
    <>
      <Snackbars />
      <Button size="small" onClick={() => displaySnackbar({ title: args.title, ...args })}>
        Show snackbar 1
      </Button>
    </>
  )
}

export const Clickable = ClickableTemplate.bind({})
