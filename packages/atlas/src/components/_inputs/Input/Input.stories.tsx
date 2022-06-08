import { useRef } from '@storybook/addons'
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { Avatar } from '@/components/Avatar'
import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionBid, SvgActionClose, SvgActionSearch, SvgJoyTokenMonochrome16 } from '@/components/_icons'
import { cVar } from '@/styles'
import { formatNumber } from '@/utils/number'

import { Input, InputProps } from '.'

export default {
  title: 'inputs/Input',
  component: Input,
  args: {
    size: 'large',
    type: 'text',
    placeholder: 'placeholder text',
  },
  argTypes: {
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
} as Meta

const TemplateWithUncontrolledInput: Story<InputProps> = (args) => {
  const ref = useRef<HTMLInputElement | null>(null)
  return (
    <>
      <Input {...args} ref={ref} />
      <div style={{ marginTop: 16 }}>
        <Button onClick={() => alert(ref.current?.value)}>Show input value</Button>
      </div>
    </>
  )
}

const Template: Story<InputProps> = (args) => <Input {...args} />

const TemplateWithControlledInput: Story<InputProps> = (args) => {
  const [value, setValue] = useState('')
  return <Input {...args} onChange={(e) => setValue(e.currentTarget.value)} value={value} />
}

const TemplateWithPreffixAndSuffix: Story<InputProps> = (args) => {
  const [dollars, setDollars] = useState<number>()
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Input
        {...args}
        nodeStart={<Pill label="label" />}
        nodeEnd={
          <Text secondary color={cVar('colorTextMuted')} variant="t300">
            $
          </Text>
        }
      />
      <Input
        {...args}
        nodeStart={<Avatar size="bid" assetUrl="https://placedog.net/360/203" />}
        nodeEnd={<Pill label="500$" />}
      />
      <Input
        {...args}
        type="number"
        value={dollars}
        onChange={(e) => setDollars(Number(e.currentTarget.value))}
        nodeStart={<SvgJoyTokenMonochrome16 />}
        nodeEnd={
          <Text secondary color={cVar('colorTextMuted')} variant="t300">
            $ {formatNumber((dollars || 0) * 4)}
          </Text>
        }
      />
      <Input
        {...args}
        nodeStart={<SvgActionBid />}
        nodeEnd={
          <Text secondary color={cVar('colorTextMuted')} variant="t300">
            some random text
          </Text>
        }
      />
    </div>
  )
}

export const WithControlledInput = TemplateWithControlledInput.bind({})

export const Default = TemplateWithUncontrolledInput.bind({})

export const WithButton = Template.bind({})

WithButton.args = {
  placeholder: 'placeholder text',
  actionButton: {
    icon: <SvgActionClose />,
  },
  nodeStart: <SvgActionSearch />,
}

export const WithPreffixAndSuffix = TemplateWithPreffixAndSuffix.bind({})

WithPreffixAndSuffix.argTypes = {
  type: { table: { disable: true } },
}
