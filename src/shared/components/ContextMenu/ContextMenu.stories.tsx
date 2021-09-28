/* eslint-disable @typescript-eslint/no-empty-function */
import { Meta, Story } from '@storybook/react'
import React from 'react'

import { OverlayManagerProvider } from '@/providers/overlayManager'
import { SvgGlyphCopy, SvgGlyphEdit, SvgGlyphTrash } from '@/shared/icons'

import { ContextMenu, ContextMenuItem } from './ContextMenu'

import { Button } from '../Button'

export default {
  title: 'Shared/C/ContextMenu',
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
          content={
            <div>
              <ContextMenuItem icon={<SvgGlyphEdit />} onClick={() => {}}>
                Edit video
              </ContextMenuItem>
              <ContextMenuItem icon={<SvgGlyphCopy />} onClick={() => {}}>
                Copy video URL
              </ContextMenuItem>
              <ContextMenuItem icon={<SvgGlyphTrash />} onClick={() => {}}>
                Delete video
              </ContextMenuItem>
            </div>
          }
          {...args}
        >
          <Button>Open menu on the left side</Button>
        </ContextMenu>
      </div>
    </>
  )
}

export const Regular = Template.bind({})
