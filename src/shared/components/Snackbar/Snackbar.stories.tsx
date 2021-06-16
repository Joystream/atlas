import { Meta, Story } from '@storybook/react'
import React from 'react'

import { SnackbarProvider, useSnackbar, DisplaySnackbarArgs } from '@/providers/useSnackbar/useSnackbar'

import { Snackbar } from './Snackbar'

import { Button } from '../Button'

export default {
  title: 'Shared/S/Snackbar',
  component: Snackbar,
  argTypes: {
    title: { defaultValue: 'Lorem ipsul dolor' },
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
