import React from 'react'
import ContextMenu, { MenuItem } from './ContextMenu'
import { useContextMenu } from '@/hooks'
import { Button } from '@/shared/components'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'Shared/ContextualMenu',
  component: ContextMenu,
} as Meta

const Template: Story = (args) => {
  const { openContextMenu, closeContextMenu, contextMenuOpts } = useContextMenu()
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={openContextMenu}>Open menu on the left side</Button>
        <Button onClick={openContextMenu}>Open menu on the right side</Button>
      </div>
      <div>
        <ContextMenu contextMenuOpts={contextMenuOpts} {...args}>
          <MenuItem iconName="info" onClick={closeContextMenu}>
            Edit video
          </MenuItem>
          <MenuItem iconName="success" onClick={closeContextMenu}>
            Copy video URL
          </MenuItem>
          <MenuItem iconName="error" onClick={closeContextMenu}>
            Delete video
          </MenuItem>
        </ContextMenu>
      </div>
    </>
  )
}

export const Regular = Template.bind({})
