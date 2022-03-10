import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { TextField } from '@/components/_inputs/TextField'
import { OverlayManagerProvider } from '@/providers/overlayManager'

import { BottomDrawer, BottomDrawerProps } from './BottomDrawer'

export default {
  title: 'overlays/BottomDrawer',
  component: BottomDrawer,
  args: {
    title: 'Test drawer',
    titleLabel: 'Test',
  },
  argTypes: {
    isOpen: { table: { disable: true } },
    onClose: { table: { disable: true } },
    actionBar: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta

const Template: Story<BottomDrawerProps> = (args) => {
  const [isOpen, setIsOpen] = useState(false)
  const [actionBarOpen, setActionBarOpen] = useState(false)
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open drawer</Button>
      <BottomDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={args.title}
        titleLabel={args.titleLabel}
        actionBar={{
          variant: 'edit',
          primaryButton: {
            text: 'Submit',
            disabled: !actionBarOpen,
          },
          secondaryButton: {
            text: 'Cancel',
            onClick: () => setActionBarOpen(false),
          },
        }}
        coverTopbar={args.coverTopbar}
      >
        <Content>
          <Button onClick={() => setActionBarOpen((prev) => !prev)}>Toggle action bar</Button>
          <FormField title="Test field">
            <TextField />
          </FormField>
          <FormField title="Test field">
            <TextField />
          </FormField>
          <FormField title="Test field">
            <TextField />
          </FormField>
          <FormField title="Test field">
            <TextField />
          </FormField>
          <FormField title="Test field">
            <TextField />
          </FormField>
        </Content>
      </BottomDrawer>
    </div>
  )
}

export const Regular = Template.bind({})

const Content = styled.div`
  padding: 20px 60px;
  width: 100%;
`
