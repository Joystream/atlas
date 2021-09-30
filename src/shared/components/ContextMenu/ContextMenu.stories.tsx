/* eslint-disable @typescript-eslint/no-empty-function */
import { Meta, Story } from '@storybook/react'
import React, { useRef } from 'react'

import { OverlayManagerProvider } from '@/providers/overlayManager'
import { SvgGlyphCopy, SvgGlyphEdit, SvgGlyphTrash } from '@/shared/icons'

import { ContextMenu, ContextMenuItem } from './ContextMenu'

import { Button } from '../Button'
import { TippyInstance } from '../Popover'

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
  const ref = useRef<TippyInstance>()
  return (
    <>
      <div>
        <ContextMenu
          instanceRef={ref}
          content={
            <div>
              <ContextMenuItem
                icon={<SvgGlyphEdit />}
                onClick={() => {
                  ref.current?.hide()
                }}
              >
                Edit video
              </ContextMenuItem>
              <ContextMenuItem
                icon={<SvgGlyphCopy />}
                onClick={() => {
                  ref.current?.hide()
                }}
              >
                Copy video URL
              </ContextMenuItem>
              <ContextMenuItem
                icon={<SvgGlyphTrash />}
                onClick={() => {
                  ref.current?.hide()
                }}
              >
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
