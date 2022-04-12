import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { Button } from '@/components/_buttons/Button'
import { SvgActionTrash } from '@/components/_icons'
import { Snackbars, useSnackbar } from '@/providers/snackbars'
import { DisplaySnackbarArgs } from '@/providers/snackbars/store'

import { Snackbar } from './Snackbar'

export default {
  title: 'other/Snackbar',
  component: Snackbar,
  argTypes: {
    iconType: {
      control: { type: 'select', options: [null, 'error', 'success', 'info', 'warning', 'uploading', 'loading'] },
    },
    actionIcon: {
      control: { type: 'inline-radio', options: [null, 'SvgActionTrash'] },
    },
    timeout: { control: { type: 'number' } },
    icon: { table: { disable: true } },
    onActionClick: { table: { disable: true } },
    onClick: { table: { disable: true } },
    onMouseEnter: { table: { disable: true } },
    onMouseLeave: { table: { disable: true } },
  },
  args: {
    title: 'Lorem ipsul dolor',
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo, veniam assumenda!',
    actionText: 'Action',
    timeout: null,
    actionIcon: null,
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
    <Button
      size="small"
      onClick={() => displaySnackbar({ ...args, actionIcon: args.actionIcon !== null && <SvgActionTrash /> })}
    >
      Show snackbar
    </Button>
  )
}

export const Clickable = ClickableTemplate.bind({})
