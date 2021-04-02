import Snackbar, { IconsType } from './Snackbar'
import React from 'react'
import { Meta, Story } from '@storybook/react'
import Button from '../Button'
import { SnackbarProvider, useSnackbar, DisplaySnackbarArgs } from '@/hooks/useSnackbar/useSnackbar'

export default {
  title: 'Shared/Snackbar',
  component: Snackbar,
  argTypes: {
    message: { defaultValue: 'Lorem ipsul dolor' },
    subMessage: { defaultValue: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo, veniam assumenda!' },
    actionText: { defaultValue: 'Action' },
    variant: {
      control: { type: 'select', options: ['primary', 'secondary'] },
      defaultValue: 'secondary',
    },
    icon: {
      control: { type: 'select', options: [null, 'error', 'success', 'info'] },
      defaultValue: null,
    },
    time: { control: { type: 'number' }, defaultValue: null },
  },
  decorators: [
    (Story) => (
      <SnackbarProvider>
        <Story />
      </SnackbarProvider>
    ),
  ],
} as Meta

const ClickableTemplate: Story<DisplaySnackbarArgs> = ({ ...args }) => {
  const { displaySnackbar } = useSnackbar()
  return (
    <Button size="small" onClick={() => displaySnackbar({ ...args })}>
      Show snackbar
    </Button>
  )
}

export const Clickable = ClickableTemplate.bind({})
