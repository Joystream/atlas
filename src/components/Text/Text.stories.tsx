import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Text, TextProps } from './Text'

export default {
  title: 'other/Text',
  component: Text,
} as Meta

const Template: Story<Omit<TextProps, 'ref' | 'variant'>> = (args) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
    <Text {...args} variant="h900">
      Hero
    </Text>
    <Text {...args} variant="h800">
      Heading 1
    </Text>
    <Text {...args} variant="h700">
      Heading 2
    </Text>
    <Text {...args} variant="h600">
      Heading 3
    </Text>
    <Text {...args} variant="h500">
      Heading 4
    </Text>
    <Text {...args} variant="h400">
      Heading 5
    </Text>
    <Text {...args} variant="h300">
      Heading 6
    </Text>
    <Text {...args} variant="h400">
      Subtitle 1
    </Text>
    <Text {...args} variant="h400">
      Subtitle 2
    </Text>
    <Text {...args} variant="t300">
      Body 1
    </Text>
    <Text {...args} variant="t200">
      Body 2
    </Text>
    <Text {...args} variant="t100">
      Caption
    </Text>
    <Text {...args} variant="h100">
      Overhead
    </Text>
    <Text {...args} variant="t300-strong">
      Button 1
    </Text>
    <Text {...args} variant="t200-strong">
      Button 2
    </Text>
    <Text {...args} variant="t100-strong">
      Button 3
    </Text>
  </div>
)

export const Regular = Template.bind({})
