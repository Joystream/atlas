import { Meta, StoryFn } from '@storybook/react'

import { Button } from '@/components/_buttons/Button'
import { usePersonalDataStore } from '@/providers/personalData'

import { Banner, BannerProps } from '.'
import { SvgActionWarning, SvgAlertsInformative24 } from '../../assets/icons'

export default {
  title: 'other/Banner',
  component: Banner,
  args: {
    dismissibleId: 'some-id',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, animi tempore dicta vero temporibus debitis.',
    title: 'Banner Title',
    icon: <SvgAlertsInformative24 />,
  },
} as Meta

const Template: StoryFn<BannerProps> = (args) => {
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)
  return (
    <>
      <Banner {...args} />
      <div style={{ marginTop: 16 }}>
        <Button
          onClick={() => {
            if (!args.dismissibleId) return
            updateDismissedMessages(args.dismissibleId, false)
          }}
        >
          Reset
        </Button>
      </div>
    </>
  )
}

export const Default = Template.bind({})

export const WithDifferentIcon = Template.bind({})
WithDifferentIcon.args = {
  icon: <SvgActionWarning />,
}

export const WithoutTitle = Template.bind({})
WithoutTitle.args = {
  title: '',
}
export const WithoutIcon = Template.bind({})
WithoutIcon.args = {
  icon: undefined,
}
WithoutIcon.argTypes = {
  icon: { table: { disable: true } },
}

export const WithActionButton = Template.bind({})
WithActionButton.args = {
  actionButton: {
    text: 'Action',
    onClick: () => undefined,
  },
}
