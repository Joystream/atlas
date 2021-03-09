import React from 'react'
import { Button, Text } from '@/shared/components'
import {
  StyledTopbarBase,
  StudioContainer,
  MemberInfoContainer,
  StyledAvatar,
  TextContainer,
  NavDrawerContainer,
} from './StudioTopbar.style'

const MemberInfo: React.FC = () => {
  return (
    <MemberInfoContainer>
      <StyledAvatar imageUrl="https://picsum.photos/200/300" />
      <TextContainer>
        <Text>Wild Crypto Fan16</Text>
        <Text>Mikael Cowan</Text>
      </TextContainer>
    </MemberInfoContainer>
  )
}

const NavDrawer: React.FC = () => {
  return (
    <NavDrawerContainer>
      <MemberInfo />
      <MemberInfo />
    </NavDrawerContainer>
  )
}

const StudioTopbar: React.FC = () => {
  return (
    <>
      <StyledTopbarBase variant="studio">
        <StudioContainer>
          <Button icon="add-video" />
          <MemberInfo />
          <Button icon="chevron-down" variant="tertiary" />
        </StudioContainer>
      </StyledTopbarBase>
      <NavDrawer />
    </>
  )
}

export default StudioTopbar
