// based on https://github.com/jonsuh/hamburgers licensed under MIT

import styled from '@emotion/styled'
import { colors, sizes, zIndex, media } from '../../theme'

type HamburgerInnerProps = {
  active: boolean
}

export const Hamburger = styled.button`
  height: ${sizes(11)};
  width: ${sizes(11)};
  padding: 0;
  top: 18px;
  // FIXME: this shouldn't be set to 'fixed', button should work on its own, consumer may set it to fixed
  position: fixed;
  z-index: ${zIndex.sideNav};
  cursor: pointer;
  background-color: ${colors.gray[700]};
  border: none;
  border-radius: 100%;
  display: inline-block;
  margin-left: ${sizes(3)};
  &:hover {
    background-color: rgba(0, 0, 0, 0.12);
  }
  &:focus {
    background-color: rgba(0, 0, 0, 0.24);
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.4);
  }

  ${media.medium} {
    top: 16px;
    height: ${sizes(12)};
    width: ${sizes(12)};
    background: none;
  }
`

export const HamburgerBox = styled.span`
  width: 18px;
  height: 12px;
  display: inline-block;
  position: relative;
`

export const HamburgerInner = styled.span<HamburgerInnerProps>`
  display: block;
  top: 50%;
  margin-top: -1px;
  transition-duration: 0.075s;
  transition-delay: ${({ active }) => (active ? '0.12s' : '0')};
  transition-timing-function: ${({ active }) =>
    active ? 'cubic-bezier(0.215, 0.61, 0.355, 1)' : 'cubic-bezier(0.55, 0.055, 0.675, 0.19)'};
  transform: ${({ active }) => (active ? 'rotate(45deg)' : 'none')};
  &,
  &::before,
  &::after {
    width: 18px;
    height: 2px;
    background-color: ${colors.white};
    position: absolute;
  }
  &::before,
  &::after {
    content: '';
    display: block;
  }
  &::before {
    top: ${({ active }) => (active ? 0 : '-5px')};
    opacity: ${({ active }) => (active ? 0 : 1)};
    transition: ${({ active }) =>
      active ? 'top 0.075s ease, opacity 0.075s 0.12s ease' : 'top 0.075s 0.12s ease, opacity 0.075s ease'};
  }
  &::after {
    bottom: ${({ active }) => (active ? 0 : '-5px')};
    transform: ${({ active }) => (active ? 'rotate(90deg)' : 'none')};
    transition: ${({ active }) =>
      active
        ? 'bottom 0.075s ease, transform 0.075s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1)'
        : 'bottom 0.075s 0.12s ease, transform 0.075s cubic-bezier(0.55, 0.055, 0.675, 0.19)'};
  }
`
