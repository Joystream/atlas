import styled from '@emotion/styled'
import { Meta, StoryFn } from '@storybook/react'

import { JoyTokenIcon, JoyTokenIconProps } from './JoyTokenIcon'

export default {
  title: 'Icons/JoyTokenIcon',
  component: JoyTokenIcon,
} as Meta<JoyTokenIconProps>

const Template: StoryFn<JoyTokenIconProps> = (args) => {
  return (
    <Container>
      <WrapperLight>
        <JoyTokenIcon {...args} />
      </WrapperLight>
      <WrapperDark>
        <JoyTokenIcon {...args} />
      </WrapperDark>
    </Container>
  )
}

export const Default = Template.bind({})
const Container = styled.div`
  display: flex;
  flex-direction: row;
`
const WrapperLight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background: wheat;
`

const WrapperDark = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background: #0b0c0f;
  margin-left: 32px;
`
