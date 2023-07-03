import { useRef } from '@storybook/addons'
import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { SvgActionBid, SvgActionClose, SvgActionSearch, SvgJoyTokenMonochrome16 } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { Pill } from '@/components/Pill'
import { Button } from '@/components/_buttons/Button'
import { formatNumber } from '@/utils/number'

import { Input, InputProps } from '.'

export default {
  title: 'inputs/Input',
  component: Input,
  args: {
    size: 'large',
    type: 'text',
    placeholder: 'placeholder text',
    error: false,
    disabled: false,
  },
  argTypes: {
    value: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    onFocus: { table: { disable: true } },
    onKeyDown: { table: { disable: true } },
    onWheel: { table: { disable: true } },
    autoComplete: { table: { disable: true } },
    nodeEnd: { table: { disable: true } },
    nodeStart: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    actionButton: { table: { disable: true } },
  },
} as Meta<InputProps>

const TemplateWithUncontrolledInput: StoryFn<InputProps> = (args) => {
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

const Template: StoryFn<InputProps> = (args) => <Input {...args} />

const TemplateWithControlledInput: StoryFn<InputProps> = (args) => {
  const [value, setValue] = useState('')
  return <Input {...args} onChange={(e) => setValue(e.currentTarget.value)} value={value} />
}

const TemplateWithPreffixAndSuffix: StoryFn<InputProps> = (args) => {
  const [dollars, setDollars] = useState<number>()
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Input {...args} nodeStart={<Pill label="label" />} nodeEnd="$" />
      <Input
        {...args}
        nodeStart={<Avatar size={24} assetUrls={['https://placedog.net/360/203']} />}
        nodeEnd={<Pill label="500$" />}
      />
      <Input
        {...args}
        type="number"
        value={dollars}
        onChange={(e) => setDollars(Number(e.currentTarget.value))}
        nodeStart={<SvgJoyTokenMonochrome16 />}
        nodeEnd={`$ ${formatNumber((dollars || 0) * 4)}`}
      />
      <Input {...args} nodeStart={<SvgActionBid />} nodeEnd="Random text here" />
      <Input {...args} nodeStart="$" nodeEnd={<SvgActionBid />} />
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
