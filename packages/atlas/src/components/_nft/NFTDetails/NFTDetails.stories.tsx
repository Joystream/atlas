import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import React from 'react'

import { NFTDetails, NFTDetailsProps } from '.'

export default {
  title: 'NFT/NFTDetails',
  component: NFTDetails,
  argTypes: {
    size: {
      control: { type: 'select', options: ['small', 'medium'] },
      defaultValue: 'medium',
    },
    // captionPosition: {
    //   control: { type: 'select', options: ['bottom', 'right'] },
    //   defaultValue: 'bottom',
    // },
  },
  args: {
    ownerHandle: 'ye 🖤',
    ownerAvatarUri: 'https://picsum.photos/40/40',
    // caption: 'This is a caption',
    // selected: false,
    // disabled: false,
    // destructive: false,
  },
} as Meta

const Template: Story<NFTDetailsProps> = (args) => (
  <Container data-size={args.size}>
    <NFTDetails {...args} />
    <NFTDetails {...args} />
    <NFTDetails {...args} />
  </Container>
)

export const Default = Template.bind({})

const Container = styled.div<{ 'data-size': 'medium' | 'small' }>`
  display: grid;
  gap: 24px;
  width: 380px;

  &[data-size='small'] {
    width: 280px;
  }
`
