/* eslint-disable @typescript-eslint/no-empty-function */
import { Meta, Story } from '@storybook/react'
import React from 'react'

import { OverlayManagerProvider } from '@/providers/overlayManager'
import { SvgGlyphCopy } from '@/shared/icons'

import { ContextMenu } from './ContextMenu'

import { Button } from '../Button'

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
              icon: <SvgGlyphCopy />,
              onClick: () => {},
              title: 'Copy video URL',
            },
            {
              icon: <SvgGlyphCopy />,
              onClick: () => {},
              title: 'Copy video URL',
            },
            {
              icon: <SvgGlyphCopy />,
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
