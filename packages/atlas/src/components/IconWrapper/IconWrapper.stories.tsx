import { Meta, StoryFn } from '@storybook/react'

import { SvgActionTrash, SvgControlsSettingsOutline } from '@/assets/icons'

import { IconWrapper, IconWrapperProps } from './IconWrapper'

export default {
  title: 'Icons/IconWrapper',
  component: IconWrapper,
} as Meta

const TemplateSingle: StoryFn<IconWrapperProps> = (args) => <IconWrapper {...args} />

export const ActionIcon = TemplateSingle.bind({})
ActionIcon.args = {
  icon: <SvgActionTrash />,
}

export const ControlIcon = TemplateSingle.bind({})
ControlIcon.args = {
  icon: <SvgControlsSettingsOutline />,
}
