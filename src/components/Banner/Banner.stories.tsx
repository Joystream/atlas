import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Button } from '@/components/_buttons/Button'
import { usePersonalDataStore } from '@/providers/personalData'

import { Banner, BannerProps } from '.'
import { SvgActionWarning, SvgAlertsInformative24 } from '../_icons'

export default {
  title: 'other/Banner',
  component: Banner,
  args: {
    id: 'some-id',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, animi tempore dicta vero temporibus debitis.',
    title: 'Banner Title',
    icon: <SvgAlertsInformative24 />,
  },
} as Meta

const Template: Story<BannerProps> = (args) => {
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)
  return (
    <>
      <Banner {...args} />
      <Button
        onClick={() => {
          updateDismissedMessages(args.id, false)
        }}
      >
        Reset
      </Button>
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
