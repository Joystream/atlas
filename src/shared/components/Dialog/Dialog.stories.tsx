import React from 'react'
import Dialog, { DialogProps } from './Dialog'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'Shared/Dialog',
  component: Dialog,
  argTypes: {
    icon: {
      control: {
        type: 'select',
        options: ['success', 'failure', null],
      },
    },
    title: { control: 'text', defaultValue: 'De- spa- Cito' },
    content: {
      control: 'text',
      defaultValue:
        'Sí, sabes que ya llevo un rato mirándote Tengo que bailar contigo hoy (DY) Vi que tu mirada ya estaba llamándome Muéstrame el camino que yo voy',
    },
    primaryButton: { control: 'text', defaultValue: 'Confirm' },
    secondaryButton: { control: 'text', defaultValue: 'Cancel' },
    exitButton: { control: 'boolean' },
  },
}

const Template: Story<DialogProps> = ({ icon, title, content, primaryButton, secondaryButton, exitButton }) => {
  return (
    <Dialog
      title={title}
      content={content}
      primaryButton={primaryButton}
      secondaryButton={secondaryButton}
      icon={icon}
      exitButton={exitButton}
    />
  )
}

export const Regular = Template.bind({})
