import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Text, TextProps } from './Text'

export default {
  title: 'other/Text',
  component: Text,
} as Meta

const Template: Story<Omit<TextProps, 'ref' | 'variant'>> = (args) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
    <Text {...args} variant="hero">
      Hero
    </Text>
    <Text {...args} variant="h1">
      Heading 1
    </Text>
    <Text {...args} variant="h2">
      Heading 2
    </Text>
    <Text {...args} variant="h3">
      Heading 3
    </Text>
    <Text {...args} variant="h4">
      Heading 4
    </Text>
    <Text {...args} variant="h5">
      Heading 5
    </Text>
    <Text {...args} variant="h6">
      Heading 6
    </Text>
    <Text {...args} variant="subtitle1">
      Subtitle 1
    </Text>
    <Text {...args} variant="subtitle2">
      Subtitle 2
    </Text>
    <Text {...args} variant="body1">
      Body 1
    </Text>
    <Text {...args} variant="body2">
      Body 2
    </Text>
    <Text {...args} variant="caption">
      Caption
    </Text>
    <Text {...args} variant="overhead">
      Overhead
    </Text>
    <Text {...args} variant="button1">
      Button 1
    </Text>
    <Text {...args} variant="button2">
      Button 2
    </Text>
    <Text {...args} variant="button3">
      Button 3
    </Text>
  </div>
)

export const Regular = Template.bind({})
