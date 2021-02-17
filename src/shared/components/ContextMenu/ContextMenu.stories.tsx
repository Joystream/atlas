import React, { useEffect } from 'react'
import ContextMenu, { ContextMenuItem } from './ContextMenu'
import { OverlayManagerProvider, useContextMenu } from '@/hooks'
import { Button } from '@/shared/components'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'Shared/ContextMenu',
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
  const {
    openContextMenu: leftOpenContextMenu,
    closeContextMenu: leftCloseContextMenu,
    contextMenuOpts: leftContextMenuOpts,
  } = useContextMenu()
  const {
    openContextMenu: rightOpenContextMenu,
    closeContextMenu: rightCloseContextMenu,
    contextMenuOpts: rightContextMenuOpts,
  } = useContextMenu()
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={leftOpenContextMenu}>Open menu on the left side</Button>
        <Button onClick={rightOpenContextMenu}>Open menu on the right side</Button>
      </div>
      <div>
        <ContextMenu contextMenuOpts={leftContextMenuOpts} {...args}>
          <ContextMenuItem iconName="info" onClick={leftCloseContextMenu}>
            Edit video
          </ContextMenuItem>
          <ContextMenuItem iconName="success" onClick={leftCloseContextMenu}>
            Copy video URL
          </ContextMenuItem>
          <ContextMenuItem iconName="error" onClick={leftCloseContextMenu}>
            Delete video
          </ContextMenuItem>
        </ContextMenu>

        <ContextMenu contextMenuOpts={rightContextMenuOpts} {...args}>
          <ContextMenuItem iconName="info" onClick={rightCloseContextMenu}>
            Edit video
          </ContextMenuItem>
          <ContextMenuItem iconName="success" onClick={rightCloseContextMenu}>
            Copy video URL
          </ContextMenuItem>
          <ContextMenuItem iconName="error" onClick={rightCloseContextMenu}>
            Delete video
          </ContextMenuItem>
        </ContextMenu>
      </div>
    </>
  )
}

export const Regular = Template.bind({})
