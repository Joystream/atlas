import React from 'react'
import { Header, Hero, SubTitle } from './StudioHeader.style'

export type StudioHeaderProps = {
  title: string
  subtitle?: string
}

const StudioHeader: React.FC<StudioHeaderProps> = ({ title, subtitle }) => {
  return (
    <Header>
      <Hero variant="hero">{title}</Hero>
      <SubTitle variant="body2">{subtitle}</SubTitle>
    </Header>
  )
}

export default StudioHeader
