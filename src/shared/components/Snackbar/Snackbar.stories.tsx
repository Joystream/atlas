import Snackbar, { SnackbarProps } from './Snackbar'
import React from 'react'
import { Meta, Story } from '@storybook/react'
import Button from '../Button'
import { SnackbarProvider, useSnackbar, DisplaySnackbarArgs } from '@/hooks/useSnackbar/useSnackbar'

export default {
  title: 'Shared/Snackbar',
  component: Snackbar,
  args: {
    message: 'Lorem ipsul dolor',
    subMessage: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo, veniam assumenda!',
    actionText: 'Action',
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
    <>
      <Button size="small" onClick={() => displaySnackbar({ ...args })}>
        Show snackbar
      </Button>
    </>
  )
}

export const Clickable = ClickableTemplate.bind({})
