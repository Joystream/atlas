/* eslint-disable @typescript-eslint/no-empty-function */
import { Meta, StoryFn } from '@storybook/react'

import { SvgActionCopy } from '@/assets/icons'
import { Button } from '@/components/_buttons/Button'
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

const Template: StoryFn = (args) => {
  return (
    <>
      <div>
        <ContextMenu
          scrollable
          items={[
            {
              nodeStart: <SvgActionCopy />,
              onClick: () => {},
              label: 'Copy video URL',
            },
            {
              nodeStart: <SvgActionCopy />,
              onClick: () => {},
              label: 'Copy video URL',
            },
            {
              nodeStart: <SvgActionCopy />,
              onClick: () => {},
              label: 'Copy video URL',
            },
            {
              nodeStart: <SvgActionCopy />,
              onClick: () => {},
              label: 'Copy video URL',
            },
            {
              nodeStart: <SvgActionCopy />,
              onClick: () => {},
              label: 'Copy video URL',
            },
            {
              nodeStart: <SvgActionCopy />,
              onClick: () => {},
              label: 'Copy video URL',
            },
            {
              nodeStart: <SvgActionCopy />,
              onClick: () => {},
              label: 'Copy video URL',
            },
            {
              nodeStart: <SvgActionCopy />,
              onClick: () => {},
              label: 'Copy video URL',
            },
            {
              nodeStart: <SvgActionCopy />,
              onClick: () => {},
              label: 'Copy video URL',
            },
            {
              nodeStart: <SvgActionCopy />,
              onClick: () => {},
              label: 'Copy video URL',
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
