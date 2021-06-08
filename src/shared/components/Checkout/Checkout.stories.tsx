import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import Checkout, { CheckoutProps } from './Checkout'

import { WithValue } from '../../../../.storybook/WithValue'

export default {
  title: 'Shared/C/Checkout',
  component: Checkout,
  argTypes: {},
} as Meta

const SingleTemplate: Story<CheckoutProps> = (args) => {
  const [addChannel, setaddChannel] = useState(true)
  const [addDescription, setaddDescription] = useState(false)
  const [addAvatar, setaddAvatar] = useState(false)
  const [addCoverImage, setaddCoverImage] = useState(false)

  const steps = [
    { title: 'Add Channel Title', onClick: () => setaddChannel((value) => !value), completed: addChannel },
    { title: 'Add Description', onClick: () => setaddDescription((value) => !value), completed: addDescription },
    { title: 'Add Avatar', onClick: () => setaddAvatar((value) => !value), completed: addAvatar },
    { title: 'Add Cover Image', onClick: () => setaddCoverImage((value) => !value), completed: addCoverImage },
  ]
  return <Checkout {...args} steps={steps}></Checkout>
}

export const Single = SingleTemplate.bind({})
Single.args = {}
