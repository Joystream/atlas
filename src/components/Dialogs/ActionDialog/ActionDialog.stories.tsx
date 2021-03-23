import React, { useState } from 'react'
import ActionDialog, { ActionDialogProps } from './ActionDialog'
import { Story, Meta } from '@storybook/react'
import { Button } from '@/shared/components'
import { OverlayManagerProvider } from '@/hooks/useOverlayManager'

export default {
  title: 'General/ActionDialog',
  component: ActionDialog,
  args: {
    showAdditionalAction: false,
  },
  argTypes: {
    exitButton: { defaultValue: true },
    primaryButtonText: { defaultValue: 'hello darkness' },
    secondaryButtonText: { defaultValue: 'my old friend' },
    showDialog: { table: { disable: true } },
    additionalActionsNode: { table: { disable: true } },
    warning: { defaultValue: false },
    error: { defaultValue: false },
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

const RegularTemplate: Story<StoryProps> = ({ showAdditionalAction, ...args }) => {
  return (
    <ActionDialog {...args} showDialog={true} additionalActionsNode={showAdditionalAction && additionalActionNode} />
  )
}
export const Regular = RegularTemplate.bind({})

const ContentTemplate: Story<StoryProps> = ({ showAdditionalAction, ...args }) => {
  return (
    <ActionDialog {...args} showDialog={true} additionalActionsNode={showAdditionalAction && additionalActionNode}>
      {content}
    </ActionDialog>
  )
}
export const WithContent = ContentTemplate.bind({})

const TransitionTemplate: Story<StoryProps> = ({ showAdditionalAction, ...args }) => {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>Open Dialog</Button>
      <ActionDialog
        {...args}
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
