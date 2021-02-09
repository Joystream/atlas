import React, { useState } from 'react'
import Dialog, { DialogProps } from './Dialog'
import { Story } from '@storybook/react'
import { Button } from '@/shared/components'

export default {
  title: 'Shared/Dialog',
  component: Dialog,
  argTypes: {
    icon: {
      control: {
        type: 'select',
        options: ['success', 'failure', null],
      },
      defaultValue: 'success',
    },
    title: { control: 'text', defaultValue: 'De- spa- Cito' },
    content: {
      control: 'text',
      defaultValue:
        'Sí, sabes que ya llevo un rato mirándote Tengo que bailar contigo hoy (DY) Vi que tu mirada ya estaba llamándome Muéstrame el camino que yo voy',
    },
    primaryButton: { control: 'text', defaultValue: 'Confirm' },
    secondaryButton: { control: 'text', defaultValue: 'Cancel' },
    exitButton: { control: 'boolean', defaultValue: true },
  },
}

const RegularTemplate: Story<DialogProps> = ({ icon, title, content, primaryButton, secondaryButton, exitButton }) => {
  return (
    <Dialog
      title={title}
      content={content}
      primaryButton={primaryButton}
      secondaryButton={secondaryButton}
      icon={icon}
      exitButton={exitButton}
      showDialog={true}
    />
  )
}

export const Regular = RegularTemplate.bind({})

const TransitionTemplate: Story<DialogProps> = ({
  icon,
  title,
  content,
  primaryButton,
  secondaryButton,
  exitButton,
}) => {
  const [showDialog, setShowDialog] = useState(false)

  const handleExit = () => {
    setShowDialog(false)
  }
  const handlePrimaryButton = () => {
    setShowDialog(false)
  }
  const handleSecondaryButton = () => {
    setShowDialog(false)
  }

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>Open Dialog</Button>
      <Dialog
        title={title}
        content={content}
        primaryButton={primaryButton}
        secondaryButton={secondaryButton}
        icon={icon}
        exitButton={exitButton}
        handleExit={handleExit}
        handlePrimaryButton={handlePrimaryButton}
        handleSecondaryButton={handleSecondaryButton}
        showDialog={showDialog}
      />
    </>
  )
}

export const Transition = TransitionTemplate.bind({})
