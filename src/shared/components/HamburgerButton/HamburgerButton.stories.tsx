import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import HamburgerButton, { HamburgerButtonProps } from './HamburgerButton'
import { colors } from '@/shared/theme'

export default {
  title: 'Shared/H/HamburgerButton',
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
  background-color: ${colors.gray['800']};
  width: 70px;
  height: 50px;
  margin-top: -10px;
`
