import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { Button } from '@/components/_buttons/Button'
import { Snackbars, useSnackbar } from '@/providers/snackbars'
import { DisplaySnackbarArgs } from '@/providers/snackbars/store'

import { Snackbar } from './Snackbar'

export default {
  title: 'other/Snackbar',
  component: Snackbar,
  argTypes: {
    iconType: {
      control: { type: 'select', options: [null, 'error', 'success', 'info', 'warning'] },
    },
    timeout: { control: { type: 'number' } },
  },
  args: {
    title: 'Lorem ipsul dolor',
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo, veniam assumenda!',
    actionText: 'Action',
    timeout: null,
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
  const { displaySnackbar } = useSnackbar()
  return (
    <Button size="small" onClick={() => displaySnackbar({ ...args })}>
      Show snackbar
    </Button>
  )
}

export const Clickable = ClickableTemplate.bind({})
