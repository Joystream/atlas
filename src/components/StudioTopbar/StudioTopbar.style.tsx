import React from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { breakpoints, colors, sizes, transitions, typography } from '@/shared/theme'
import { TopbarBase, Avatar, Text, Button, TOP_NAVBAR_HEIGHT, TopbarBaseProps } from '@/shared/components'

type ChannelInfoProps = {
  active?: boolean
}

type NavDrawerProps = {
  active?: boolean
}

type DrawerButtonProps = {
  isActive?: boolean
}

export const StyledTopbarBase = styled((props: TopbarBaseProps) => <TopbarBase {...props} />)`
  display: flex;
  justify-content: space-between;
  @media screen and (min-width: ${breakpoints.small}) {
    display: flex;
    justify-content: space-between;
  }
`

export const DrawerButton = styled(Button)<DrawerButtonProps>`
  svg {
    transform: rotate(${({ isActive }) => (isActive ? '180deg' : '0')});
    transition: transform ${transitions.timings.regular} ${transitions.easing};
  }
`

export const ChannelInfoContainer = styled.div<ChannelInfoProps>`
  display: flex;
  align-items: center;
  background-color: ${({ active }) => active && colors.gray[600]};
  &:hover {
    cursor: pointer;
    background-color: ${({ active }) => (active ? colors.gray[600] : colors.gray[700])};
  }
  svg {
    margin-left: auto;
    margin-right: 12px;
  }
`

export const StyledAvatar = styled(Avatar)`
  width: 42px;
  height: 42px;
  margin-left: 20px;
  margin-right: 10px;
`

export const TextContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  width: 150px;
  p:nth-of-type(1) {
    font-size: ${typography.sizes.body1};
    color: ${colors.white};
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  p:nth-of-type(2) {
    font-size: ${typography.sizes.caption};
    color: ${colors.gray[100]};
    opacity: 0.4;
  }
`

export const StudioContainer = styled.div`
  display: none;
  align-items: center;
  margin-left: auto;
  margin-right: 12px;
  svg {
    width: auto;
    height: auto;
  }
  button {
    cursor: pointer;
  }
  @media screen and (min-width: ${breakpoints.small}) {
    display: flex;
  }
  ${ChannelInfoContainer} {
    &:hover {
      background-color: ${colors.transparent};
    }
    ${TextContainer} {
      display: none;
      @media screen and (min-width: ${breakpoints.medium}) {
        display: flex;
      }
    }
  }
`

export const DrawerContainer = styled.div<NavDrawerProps>`
  position: absolute;
  right: 10px;
  top: 0;
  width: 332px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px;
  transform: translateY(${({ active }) => (active ? `${TOP_NAVBAR_HEIGHT}px` : '-100%')});
  background-color: ${colors.gray[800]};
  transition: transform ${transitions.timings.regular} ${transitions.easing};
  ${ChannelInfoContainer} {
    padding: ${sizes(2)};
  }
  ${StyledAvatar} {
    margin-left: 0;
  }
`

export const MemberInfoContainer = styled.div`
  display: flex;
  align-items: center;
  margin: calc(-1 * 12px);
  margin-bottom: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  padding: 20px;
  ${StyledAvatar} {
    width: 32px;
    height: 32px;
  }
`

export const MemberTextContainer = styled.div`
  display: flex;
  align-items: center;
`

export const MemberTitleText = styled(Text)`
  background-color: ${colors.gray[400]};
  color: ${colors.white};
  font-size: 10px;
  padding: 4px;
  opacity: 0.6;
  margin-left: 12px;
`

export const StyledLink = styled(Link)`
  text-decoration: none;
`

export const NewChannel = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px;
  p:nth-of-type(1) {
    font-size: ${typography.sizes.body1};
    color: ${colors.white};
    text-decoration: none;
  }
  &:hover {
    cursor: pointer;
    background-color: ${colors.gray[700]};
  }
`

export const NewChannelIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 42px;
  height: 42px;
  background-color: ${colors.gray[600]};
  border-radius: 100%;
  svg {
    opacity: 0.4;
  }
`

export const LogoutButton = styled(Button)`
  background-color: transparent;
  cursor: pointer;
`
