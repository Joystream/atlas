import React from 'react'
import CircularProgressbar, { CircularProgressbarProps } from './CircularProgressbar'
import { Meta, Story } from '@storybook/react'
import { css } from '@emotion/react'

export default {
  title: 'Shared/CircularProgressbar',
  component: CircularProgressbar,
  argTypes: {},
} as Meta

const SingleTemplate: Story<CircularProgressbarProps> = (args) => (
  <div
    css={css`
      display: flex;
      gap: 1rem;
      align-items: center;
    `}
  >
    <div
      css={css`
        width: 24px;
        height: 24px;
      `}
    >
      <CircularProgressbar {...args}></CircularProgressbar>
    </div>
    <div
      css={css`
        width: 48px;
        height: 48px;
      `}
    >
      <CircularProgressbar {...args}></CircularProgressbar>
    </div>
    <div
      css={css`
        width: 96px;
        height: 96px;
      `}
    >
      <CircularProgressbar {...args}></CircularProgressbar>
    </div>
  </div>
)

export const Single = SingleTemplate.bind({})
Single.args = {
  value: 30,
}
