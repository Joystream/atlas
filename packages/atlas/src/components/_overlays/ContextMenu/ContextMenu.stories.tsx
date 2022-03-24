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
  argTypes: {
    onHide: { table: { disable: true } },
    className: { table: { disable: true } },
    items: { table: { disable: true } },
    triggerTarget: { table: { disable: true } },
    trigger: { table: { disable: true } },
    size: { control: { type: 'select', options: ['small', 'medium', 'large'] } },
  },
  args: {
    scrollable: false,
  },
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
          scrollable
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
