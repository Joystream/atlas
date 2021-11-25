/* eslint-disable @typescript-eslint/no-empty-function */
import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Button } from '@/components/_buttons/Button'
import { SvgActionCopy } from '@/components/_icons'
import { OverlayManagerProvider } from '@/providers/overlayManager'

import { ContextMenu } from './ContextMenu'

export default {
  title: 'overlays/ContextMenu',
  component: ContextMenu,
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta

const Template: Story = (args) => {
  return (
    <>
      <div>
        <ContextMenu
          items={[
            {
              icon: <SvgActionCopy />,
              onClick: () => {},
              title: 'Copy video URL',
            },
            {
              icon: <SvgActionCopy />,
              onClick: () => {},
              title: 'Copy video URL',
            },
            {
              icon: <SvgActionCopy />,
              onClick: () => {},
              title: 'Copy video URL',
            },
          ]}
          trigger={<Button>Open menu on the left side</Button>}
          {...args}
        />
      </div>
    </>
  )
}

export const Regular = Template.bind({})
