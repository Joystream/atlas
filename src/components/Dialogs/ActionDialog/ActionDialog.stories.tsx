import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { OverlayManagerProvider } from '@/providers/overlayManager'
import { Button } from '@/shared/components'

import { ActionDialog, ActionDialogProps } from './ActionDialog'

export default {
  title: 'General/ActionDialog',
  component: ActionDialog,
  args: {
    showAdditionalAction: false,
  },
  argTypes: {
    exitButton: { defaultValue: true },
    primaryButtonText: { defaultValue: 'hello darkness', type: { name: 'string', required: false } },
    secondaryButtonText: { defaultValue: 'my old friend', type: { name: 'string', required: false } },
    showDialog: { table: { disable: true } },
    additionalActionsNode: { table: { disable: true } },
    warning: { defaultValue: false },
    error: { defaultValue: false },
    primaryButton: { table: { disable: true } },
    secondaryButton: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta

type StoryProps = ActionDialogProps & {
  showAdditionalAction?: boolean
}

const additionalActionNode = (
  <div>
    <span>Action</span>
  </div>
)

const content = (
  <div>
    <p style={{ marginTop: 0 }}>This is an example page content</p>
    <p style={{ marginBottom: 0 }}>It consists of 2 paragraphs</p>
  </div>
)

const RegularTemplate: Story<StoryProps & any> = ({
  showAdditionalAction,
  primaryButtonText,
  secondaryButtonText,
  ...args
}) => {
  return (
    <ActionDialog
      {...args}
      primaryButton={{ text: primaryButtonText }}
      secondaryButton={{ text: secondaryButtonText }}
      showDialog={true}
      additionalActionsNode={showAdditionalAction && additionalActionNode}
    />
  )
}
export const Regular = RegularTemplate.bind({})

const ContentTemplate: Story<StoryProps & any> = ({
  showAdditionalAction,
  primaryButtonText,
  secondaryButtonText,
  ...args
}) => {
  return (
    <ActionDialog
      {...args}
      primaryButton={{ text: primaryButtonText }}
      secondaryButton={{ text: secondaryButtonText }}
      showDialog={true}
      additionalActionsNode={showAdditionalAction && additionalActionNode}
    >
      {content}
    </ActionDialog>
  )
}
export const WithContent = ContentTemplate.bind({})

const TransitionTemplate: Story<StoryProps & any> = ({
  showAdditionalAction,
  primaryButtonText,
  secondaryButtonText,
  ...args
}) => {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>Open Dialog</Button>
      <ActionDialog
        {...args}
        primaryButton={{ text: primaryButtonText }}
        secondaryButton={{ text: secondaryButtonText }}
        onExitClick={() => setShowDialog(false)}
        showDialog={showDialog}
        additionalActionsNode={showAdditionalAction && additionalActionNode}
      >
        {content}
      </ActionDialog>
    </>
  )
}
export const Transition = TransitionTemplate.bind({})
