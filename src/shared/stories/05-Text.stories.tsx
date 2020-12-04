import React from 'react'
import { Text } from '../components'

export default {
  title: 'Text',
  component: Text,
}

export const Primary = () => (
  <div style={{ backgroundColor: 'black' }}>
    <Text variant="hero">Hero</Text>
    <Text variant="h1">Heading 1</Text>
    <Text variant="h2">Heading 2</Text>
    <Text variant="h3">Heading 3</Text>
    <Text variant="h4">Heading 4</Text>
    <Text variant="h5">Heading 5</Text>
    <Text variant="h6">Heading 6</Text>
    <Text variant="subtitle1">Subtitle 1</Text>
    <Text variant="subtitle2">Subtitle 2</Text>
    <Text variant="body1">Body 1</Text>
    <Text variant="body2">Body 2</Text>
    <Text variant="caption">Caption</Text>
    <Text variant="overhead">Overhead</Text>
  </div>
)
