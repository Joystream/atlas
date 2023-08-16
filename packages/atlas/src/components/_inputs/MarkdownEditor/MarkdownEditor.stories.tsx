import { Meta, StoryObj } from '@storybook/react'

import { MarkdownEditorProps, MarkdownEditor as MarkdownEditor_ } from './MarkdownEditor'

export default {
  title: 'inputs/MarkdownEditor',
  component: MarkdownEditor_,

  args: {
    value: '',
    placeholder: 'Placeholder',
  },
} as Meta

export const MarkdownEditor: StoryObj<MarkdownEditorProps> = {}
