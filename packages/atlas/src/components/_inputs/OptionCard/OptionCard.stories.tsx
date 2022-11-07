import { Meta, Story } from '@storybook/react'
import { MouseEvent, useState } from 'react'

import { SvgActionTrash } from '@/assets/icons'

import { OptionCardBase, OptionCardProps, OptionCardRadio } from './OptionCard'

import { OptionCardCheckbox } from '.'

export default {
  title: 'inputs/OptionCard',
  component: OptionCardBase,
  args: {
    label: 'Radio input label',
    caption: 'Radio helper text',
    disabled: false,
    error: false,
  },
} as Meta

const Template: Story<OptionCardProps> = (args) => {
  const [selected, setSelected] = useState<string | number>('1')
  const handleClick: (e: MouseEvent<HTMLElement>) => void = (e) => {
    const element = e.currentTarget as HTMLInputElement
    setSelected(element.value)
  }

  const [selected1, setSelected1] = useState<boolean>(true)
  const [selected2, setSelected2] = useState<boolean>(false)
  const [selected3, setSelected3] = useState<boolean>(false)

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '250px 250px 250px', gap: '16px' }}>
        <OptionCardRadio {...args} icon={<SvgActionTrash />} value="1" selectedValue={selected} onClick={handleClick} />
        <OptionCardRadio {...args} value="2" selectedValue={selected} onClick={handleClick} />
        <OptionCardRadio {...args} value="3" selectedValue={selected} onClick={handleClick} />
      </div>
      <div style={{ display: 'grid', marginTop: '8px', gridTemplateColumns: '250px 250px 250px', gap: '16px' }}>
        <OptionCardCheckbox
          {...args}
          icon={<SvgActionTrash />}
          value={selected1}
          onClick={() => setSelected1((value) => !value)}
        />
        <OptionCardCheckbox {...args} value={selected2} onClick={() => setSelected2((value) => !value)} />
        <OptionCardCheckbox {...args} value={selected3} onClick={() => setSelected3((value) => !value)} />
      </div>
    </>
  )
}

export const Default = Template.bind({})
