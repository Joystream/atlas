import React from 'react'
import styled from '@emotion/styled'
import { SideNavbar, SIDENAVBAR_WIDTH } from '../components'
import { NavItemType } from '../components/SideNavbar'

export default {
  title: 'SideNavbar',
  component: SideNavbar,
}

const NAV_ITEMS: NavItemType[] = [
  {
    name: 'Home',
    icon: 'home',
    iconFilled: 'home-fill',
    to: '/',
  },
  {
    icon: 'binocular',
    iconFilled: 'binocular-fill',
    name: 'Discover',
    to: '/browse',
    subitems: [
      {
        name: 'Channels 1',
      },
      {
        name: 'Channels 2',
      },
      {
        name: 'Channels 3',
      },
      {
        name: 'Channels 4',
      },
      {
        name: 'Channels 5',
      },
    ],
  },
]

export const Default = () => (
  <StoryStyles>
    <SideNavbar items={NAV_ITEMS} />
    <ContentWrapper>
      <p>Sensorem, barcas, et fraticinida. Zeta manducares, tanquam barbatus gallus.</p>
      <p>Sensorem, barcas, et fraticinida. Zeta manducares, tanquam barbatus gallus.</p>
      <p>Sensorem, barcas, et fraticinida. Zeta manducares, tanquam barbatus gallus.</p>
      <p>Sensorem, barcas, et fraticinida. Zeta manducares, tanquam barbatus gallus.</p>
      <p>Sensorem, barcas, et fraticinida. Zeta manducares, tanquam barbatus gallus.</p>
      <p>Sensorem, barcas, et fraticinida. Zeta manducares, tanquam barbatus gallus.</p>
    </ContentWrapper>
  </StoryStyles>
)

// this is needed because proper storybook styling isn't merged yet
// TODO: remove
const StoryStyles = styled.div`
  color: white;
  * {
    box-sizing: border-box;
  }
`

const ContentWrapper = styled.div`
  margin-left: ${SIDENAVBAR_WIDTH}px;
`
