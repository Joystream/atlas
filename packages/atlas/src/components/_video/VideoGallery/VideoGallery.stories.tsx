import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { OwnerPill } from '@/components/OwnerPill'
import { Pill, PillGroup } from '@/components/Pill'
import { IconButton } from '@/components/_buttons/IconButton'
import {
  SvgActionCopy,
  SvgActionDraft,
  SvgActionEdit,
  SvgActionJoyToken,
  SvgActionPlay,
  SvgActionTrash,
  SvgIllustrativeEdit,
  SvgIllustrativePlay,
} from '@/components/_icons'
import { formatDateAgo } from '@/utils/time'

import { VideoGallery } from '@/components/_video/VideoGallery';
import { ApolloClient, ApolloProvider } from '@apollo/client'
import { createApolloClient } from '@/api'

export default {
  title: 'video/VideoGallery',
  component: VideoGallery,
  argTypes: {
  },
  args: {
  },
  decorators: [
    (Story) => {
      const apolloClient = createApolloClient()
      return (
        <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <Story />
        </BrowserRouter></ApolloProvider>
      )
    },
  ],
} as Meta

const Template: Story<{}> = (args) => {
  return (
    <VideoGallery hasRanking={true} ></VideoGallery>
  )
}

export const Default = Template.bind({})

