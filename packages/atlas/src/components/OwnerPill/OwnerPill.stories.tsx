import { Meta, Story } from '@storybook/react'

import { cVar } from '@/styles'

import { OwnerPill, OwnerPillProps } from '.'

export default {
  title: 'Other/OwnerPill',
  component: OwnerPill,
  args: {
    handle: 'verylonghandle',
    avatar: { assetUrl: 'https://thispersondoesnotexist.com/image' },
  },
} as Meta

const Template: Story<OwnerPillProps> = (args) => (
  <>
    <div
      style={{
        width: '320px',
        height: '180px',
        padding: '8px',
        background: 'black',
        marginBottom: '8px',
      }}
    >
      <div style={{ maxWidth: '50%' }}>
        <OwnerPill {...args} />
      </div>
    </div>
    <div
      style={{
        width: '320px',
        height: '180px',
        padding: '8px',
        background: cVar('colorCoreBlue500'),
        marginBottom: '8px',
      }}
    >
      <div style={{ maxWidth: '50%' }}>
        <OwnerPill {...args} />
      </div>
    </div>
    <div
      style={{
        width: '320px',
        height: '180px',
        padding: '8px',
        background: 'url(https://picsum.photos/320/180)',
      }}
    >
      <div style={{ maxWidth: '50%' }}>
        <OwnerPill {...args} />
      </div>
    </div>
  </>
)

export const Default = Template.bind({})
