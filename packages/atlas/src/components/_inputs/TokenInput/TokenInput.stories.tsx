import { Meta, Story } from '@storybook/react'
import { useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { JoystreamProvider } from '@/providers/joystream'

import { TokenInput, TokenInputProps } from './TokenInput'

export default {
  title: 'inputs/TokenInput',
  component: TokenInput,
  args: {
    size: 'large',
    type: 'text',
    placeholder: 'placeholder text',
    error: false,
    disabled: false,
  },
  argTypes: {
    size: { control: { type: 'select', options: ['medium', 'large'] } },
    type: { control: { type: 'select', options: ['text', 'password', 'number'] } },
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    onFocus: { table: { disable: true } },
    onKeyDown: { table: { disable: true } },
    onWheel: { table: { disable: true } },
    autoComplete: { table: { disable: true } },
    nodeEnd: { table: { disable: true } },
    nodeStart: { table: { disable: true } },
    className: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    actionButton: { table: { disable: true } },
  },
  decorators: [
    (Story) => {
      return (
        <JoystreamProvider>
          <Story />
        </JoystreamProvider>
      )
    },
  ],
} as Meta

const Template: Story<TokenInputProps> = (args) => {
  const [value, setValue] = useState<number | null>(0)

  const setRandomValue = () => {
    const random = Math.random() * 10000
    setValue(random)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <TokenInput {...args} value={value} onChange={setValue} />
      <span>HAPIs: {tokenNumberToHapiBn(value || 0).toString()}</span>
      <Button onClick={setRandomValue}>Set random value</Button>
    </div>
  )
}
export const Default = Template.bind({})
