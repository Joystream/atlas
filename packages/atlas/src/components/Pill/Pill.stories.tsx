import { Meta, StoryFn } from '@storybook/react'

import { SvgActionAddVideo } from '@/assets/icons'

import { Pill } from './Pill'
import { PillGroup } from './PillGroup'
import { PillProps } from './types'

export default {
  title: 'Other/Pill',
  component: Pill,
  args: {
    label: 'Pill Component',
    iconPlacement: 'left',
  },
} as Meta<PillProps>

const Template: StoryFn<PillProps> = (args) => <Pill {...args} />
const TemplateGroup: StoryFn<PillProps> = (args) => (
  <PillGroup items={Array.from({ length: 6 }).map(() => args)} size={args.size} />
)

export const Default = Template.bind({})
export const Icon = Template.bind({})
export const Group = TemplateGroup.bind({})
Icon.args = {
  icon: <SvgActionAddVideo />,
}
