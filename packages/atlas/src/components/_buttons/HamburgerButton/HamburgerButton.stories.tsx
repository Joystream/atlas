import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import { useState } from 'react'

import { cVar } from '@/styles'

import { HamburgerButton, HamburgerButtonProps } from './HamburgerButton'

export default {
  title: 'button/HamburgerButton',
  component: HamburgerButton,
  argTypes: {
    active: { table: { disable: true } },
    onClick: { table: { disable: true } },
  },
} as Meta

const Template: Story<HamburgerButtonProps> = (args) => {
  const [active, setActive] = useState(args.active)

  return (
    <Wrapper>
      <HamburgerButton {...args} active={active} onClick={() => setActive(!active)} />
    </Wrapper>
  )
}

export const Regular = Template.bind({})

const Wrapper = styled.div`
  background-color: ${cVar('colorCoreNeutral800')};
  width: 70px;
  height: 50px;
  margin-top: -10px;
`
