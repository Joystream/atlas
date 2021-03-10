import React from 'react'
import Checkout, { CheckoutProps } from './Checkout'
import { Meta, Story } from '@storybook/react'
import { WithValue } from '.storybook/WithValue'

export default {
  title: 'Shared/Checkout',
  component: Checkout,
  argTypes: {},
} as Meta

const SingleTemplate: Story<CheckoutProps> = (args) => (
  <WithValue
    initial={[
      { title: 'Add Channel Title', onClick: () => alert('Add Channel Title'), completed: true },
      { title: 'Add Description', onClick: () => alert('Add Description'), completed: false },
      { title: 'Add Avatar', onClick: () => alert('Add Avatar'), completed: false },
      { title: 'Add Cover Image', onClick: () => alert('Add Cover Image'), completed: false },
    ]}
    actionName="onChange"
  >
    {(value, setValue) => <Checkout {...args} steps={value}></Checkout>}
  </WithValue>
)

export const Single = SingleTemplate.bind({})
Single.args = {}
