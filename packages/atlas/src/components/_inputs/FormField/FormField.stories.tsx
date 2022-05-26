import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { PlaceHolder } from '@/components/../../.storybook/PlaceHolder'
import { Select } from '@/components/_inputs/Select'

import { FormField, FormFieldProps } from './FormField'

import { TextArea } from '../TextArea'
import { TextField } from '../TextField'

export default {
  title: 'inputs/FormField',
  component: FormField,
  args: {
    children: <PlaceHolder />,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo mollitia sequi earum rem nostrum eveniet vero in officiis ipsam dolorem.',
    label: 'This is a title',
    optional: false,
  },
  argTypes: {
    className: { table: { disable: true } },
    switchable: { table: { disable: true } },
    switchProps: { table: { disable: true } },
    tooltip: { table: { disable: true } },
    children: {
      table: {
        disable: true,
      },
    },
  },
} as Meta<FormFieldProps>

type WithChildren = FormFieldProps & { children?: React.ReactNode }

const Template: Story<WithChildren> = (args) => <FormField {...args} />

export const Default = Template.bind({})

export const WithTextField = Template.bind({})
WithTextField.args = {
  children: <TextField />,
}

export const WithSelect = Template.bind({})
WithSelect.args = {
  children: (
    <Select
      items={[
        { name: 'first option', value: 'firstOption' },
        { name: 'second option', value: 'secondOption' },
      ]}
    />
  ),
}
export const WithTextArea = Template.bind({})
WithTextArea.args = {
  children: <TextArea placeholder="Write something here" />,
}

export const WithMultipleParagraphs = Template.bind({})
WithMultipleParagraphs.args = {
  description: [
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, enim.',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates inventore accusamus illum eius dolorum alias.',
  ],
  children: <TextField />,
}
WithMultipleParagraphs.argTypes = {
  description: {
    table: {
      disable: true,
    },
  },
}

const SwitchableTemplate: Story<FormFieldProps> = ({ ...args }) => {
  const [fieldEnabled, setFieldEnabled] = useState(false)
  const [anotherFieldEnabled, setAnotherFieldEnabled] = useState(false)
  const [textAreaEnabled, setTextAreaEnabled] = useState(false)
  return (
    <>
      <FormField
        {...args}
        switchable
        switchProps={{
          ...args.switchProps,
          onChange: () => setFieldEnabled(!fieldEnabled),
          value: fieldEnabled,
        }}
      >
        <TextField placeholder="Text field" />
      </FormField>
      <FormField
        {...args}
        switchable
        switchProps={{
          ...args.switchProps,
          onChange: () => setAnotherFieldEnabled(!anotherFieldEnabled),
          value: anotherFieldEnabled,
        }}
      >
        <TextField placeholder="Another Text field" />
      </FormField>
      <FormField
        {...args}
        switchable
        switchProps={{
          ...args.switchProps,
          onChange: () => setTextAreaEnabled(!textAreaEnabled),
          value: textAreaEnabled,
        }}
      >
        <TextArea placeholder="Text area" />
      </FormField>
    </>
  )
}

export const SwitchableFormField = SwitchableTemplate.bind({})

SwitchableFormField.args = {
  label: 'Switchable form field',
  description: '',
  switchable: true,
  tooltip: {
    placement: 'top',
    headerText: 'Some important information',
    text: 'Long description',
  },
}
