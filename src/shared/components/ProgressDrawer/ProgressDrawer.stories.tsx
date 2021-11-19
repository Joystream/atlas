import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { ProgressDrawer, ProgressDrawerProps } from './ProgressDrawer'

export default {
  title: 'other/ProgressDrawer',
  component: ProgressDrawer,
  argTypes: {},
} as Meta

const SingleTemplate: Story<ProgressDrawerProps> = (args) => {
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
  return <ProgressDrawer {...args} steps={steps}></ProgressDrawer>
}

export const Single = SingleTemplate.bind({})
Single.args = {}
