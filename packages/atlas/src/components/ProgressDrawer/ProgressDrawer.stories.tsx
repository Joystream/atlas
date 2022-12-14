import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { ProgressDrawer, ProgressDrawerProps } from './ProgressDrawer'

export default {
  title: 'other/ProgressDrawer',
  component: ProgressDrawer,
} as Meta

const SingleTemplate: StoryFn<ProgressDrawerProps> = (args) => {
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
  return <ProgressDrawer {...args} steps={steps} />
}

export const Single = SingleTemplate.bind({})
Single.args = {}
