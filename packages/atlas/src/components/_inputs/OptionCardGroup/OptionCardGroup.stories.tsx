import { Meta, Story } from '@storybook/react'
import { useState } from 'react'

import { OptionCardGroupCheckbox, OptionCardGroupProps, OptionCardGroupRadio } from '.'

export default {
  title: 'inputs/OptionCardGroup',
  component: OptionCardGroupRadio,
  args: {
    disabled: false,
    error: false,
    direction: 'horizontal',
  },
} as Meta<OptionCardGroupProps>

const Template: Story<OptionCardGroupProps> = (args) => {
  const [selected, setSelected] = useState<string | number | boolean>()

  const [checkedValues, setCheckedValues] = useState<number[]>([])

  return (
    <div style={{ display: 'grid', gap: '48px', maxWidth: '650px' }}>
      <OptionCardGroupRadio
        {...args}
        selectedValue={selected}
        options={[
          { label: 'radio1', caption: 'caption1', value: 'radio1' },
          { label: 'radio2', caption: 'caption2', value: 'radio2' },
          { label: 'radio3', caption: 'caption3', value: 'radio3' },
        ]}
        onChange={(value) => setSelected(value)}
      />

      <OptionCardGroupCheckbox
        {...args}
        checkedValues={checkedValues}
        options={[
          { label: 'checkbox1', caption: 'caption1' },
          { label: 'checkbox2', caption: 'caption2' },
          { label: 'checkbox3', caption: 'caption3' },
        ]}
        onChange={(value) =>
          setCheckedValues((values) =>
            values.includes(value) ? values.filter((v) => v !== value) : [...values, value]
          )
        }
      />
    </div>
  )
}

export const Default = Template.bind({})
