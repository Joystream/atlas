import { css } from '@emotion/react'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import Select from '../Select'
import TextArea from '../TextArea'
import TextField from '../TextField'
import FormField, { FormFieldProps } from './FormField'

export default {
  title: 'Shared/FormField',
  component: FormField,
  argTypes: {
    className: {
      table: {
        disable: true,
      },
    },
    children: {
      table: {
        disable: true,
      },
    },
    title: {
      defaultValue: 'This is a title',
    },
    description: {
      control: {
        type: 'text',
      },
      defaultValue:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo mollitia sequi earum rem nostrum eveniet vero in officiis ipsam dolorem.',
    },
  },
} as Meta

type WithChildren = FormFieldProps & { children?: React.ReactNode }

const Template: Story<WithChildren> = (args) => (
  <FormField
    {...args}
    css={css`
      max-width: 450px;
    `}
  />
)

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
