import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { Select } from '@/components/_inputs/Select'

import { FormField, FormFieldProps } from './FormField'

import { TextArea } from '../TextArea'
import { TextField } from '../TextField'

export default {
  title: 'inputs/FormField',
  component: FormField,
  args: {
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo mollitia sequi earum rem nostrum eveniet vero in officiis ipsam dolorem.',
    title: 'This is a title',
    optional: false,
  },
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
} as Meta

type WithChildren = FormFieldProps & { children?: React.ReactNode }

const Template: Story<WithChildren> = (args) => <FormField {...args} />

export const Default = Template.bind({})

export const WithTextField = Template.bind({})
WithTextField.args = {
  children: <TextField label="This is textfield" />,
}

export const WithSelect = Template.bind({})
WithSelect.args = {
  children: (
    <Select
      label="This is select"
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
  children: <TextField label="This is textfield" />,
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
        switchProps={{
          ...args.switchProps,
          onChange: () => setFieldEnabled(!fieldEnabled),
          value: fieldEnabled,
        }}
      >
        <TextField disabled={!fieldEnabled} placeholder="Text field" />
      </FormField>
      <FormField
        {...args}
        switchProps={{
          ...args.switchProps,
          onChange: () => setAnotherFieldEnabled(!anotherFieldEnabled),
          value: anotherFieldEnabled,
        }}
      >
        <TextField disabled={!anotherFieldEnabled} placeholder="Another Text field" />
      </FormField>
      <FormField
        {...args}
        switchProps={{
          ...args.switchProps,
          onChange: () => setTextAreaEnabled(!textAreaEnabled),
          value: textAreaEnabled,
        }}
      >
        <TextArea disabled={!textAreaEnabled} placeholder="Text area" />
      </FormField>
    </>
  )
}

export const SwitchableFormField = SwitchableTemplate.bind({})

SwitchableFormField.args = {
  title: 'Switchable form field',
  description: '',
  infoTooltip: {
    headerText: 'Some important information',
    text: 'Long description',
  },
}
