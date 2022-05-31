import { ApolloProvider } from '@apollo/client'
import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import React, { useEffect, useState } from 'react'

import { createApolloClient } from '@/api'
import { Button } from '@/components/_buttons/Button'
import { OverlayManagerProvider } from '@/providers/overlayManager'
import { cVar, media, sizes } from '@/styles'

import { FiltersBar, FiltersBarProps } from './FiltersBar'
import { useFiltersBar } from './useFiltersBar'

export default {
  title: 'other/FiltersBar',
  component: FiltersBar,
  args: {
    activeFilters: ['date', 'other', 'categories', 'length', 'nftStatus', 'language'],
  },
  decorators: [
    (Story) => {
      const apolloClient = createApolloClient()
      return (
        <ApolloProvider client={apolloClient}>
          <OverlayManagerProvider>
            <Story />
          </OverlayManagerProvider>
        </ApolloProvider>
      )
    },
  ],
} as Meta

const RegularTemplate: Story<FiltersBarProps> = (args) => {
  const filtersBarLogic = useFiltersBar()

  const {
    setVideoWhereInput,
    filters: { setIsFiltersOpen },
  } = filtersBarLogic
  const [selectedLanguage] = useState<string | null | undefined>('en')

  const handleFilterClick = () => {
    setIsFiltersOpen((value) => !value)
  }

  useEffect(() => {
    setVideoWhereInput((value) => ({
      ...value,
      language: {
        iso_eq: selectedLanguage,
      },
    }))
  }, [selectedLanguage, setVideoWhereInput])

  return (
    <Container>
      <ControlsContainer>
        <Button size="small" onClick={handleFilterClick}>
          Show filters bar
        </Button>
      </ControlsContainer>
      <FiltersBar {...filtersBarLogic} {...args} />
    </Container>
  )
}

export const Regular = RegularTemplate.bind({})

const Container = styled.div`
  position: relative;
  z-index: 99;
`

const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding-bottom: ${sizes(4)};
  border-bottom: 1px solid ${cVar('colorCoreNeutral700')};
  z-index: 100;
  position: relative;
  background-color: ${cVar('colorCoreBaseBlack')};
  min-height: 72px;

  ${media.md} {
    grid-template-columns: auto 160px 1fr 242px;
  }
`
