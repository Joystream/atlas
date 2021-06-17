import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { DisplaySnackbarArgs, Snackbars, useSnackbar } from '@/hooks'

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
      <>
        <BrowserRouter>
          <Story />
          <Snackbars />
        </BrowserRouter>
      </>
    ),
  ],
} as Meta

const ClickableTemplate: Story<DisplaySnackbarArgs> = ({ ...args }) => {
  const displaySnackbar = useSnackbar((state) => state.displaySnackbar)
  return (
    <Button size="small" onClick={() => displaySnackbar({ ...args })}>
      Show snackbar
    </Button>
  )
}

export const Clickable = ClickableTemplate.bind({})
