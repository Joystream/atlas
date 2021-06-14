import { Meta, Story } from '@storybook/react'
import React from 'react'

import { OverlayManagerProvider, useContextMenu } from '@/hooks'
import { Button } from '@/shared/components'
import { SvgGlyphCopy, SvgGlyphEdit, SvgGlyphTrash } from '@/shared/icons'

import { ContextMenuItem, ContextMenu } from './ContextMenu'

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
  const { openContextMenu, closeContextMenu, contextMenuOpts } = useContextMenu()
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={(e) => openContextMenu(e, 200)}>Open menu on the left side</Button>
        <Button onClick={(e) => openContextMenu(e, 200)}>Open menu on the right side</Button>
      </div>
      <div>
        <ContextMenu contextMenuOpts={contextMenuOpts} {...args}>
          <ContextMenuItem icon={<SvgGlyphEdit />} onClick={closeContextMenu}>
            Edit video
          </ContextMenuItem>
          <ContextMenuItem icon={<SvgGlyphCopy />} onClick={closeContextMenu}>
            Copy video URL
          </ContextMenuItem>
          <ContextMenuItem icon={<SvgGlyphTrash />} onClick={closeContextMenu}>
            Delete video
          </ContextMenuItem>
        </ContextMenu>
      </div>
    </>
  )
}

export const Regular = Template.bind({})
