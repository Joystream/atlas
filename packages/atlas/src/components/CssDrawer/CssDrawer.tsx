import styled from '@emotion/styled'
import { isPropValid } from '@storybook/theming'
import { ReactNode, useRef } from 'react'

import { SvgActionChevronT } from '@/assets/icons'
import { cVar, sizes, transitions } from '@/styles'

import { FlexBox } from '../FlexBox'

type CssDrawerProps = {
  children: ReactNode
  isActive: boolean
  className?: string
}

export const CssDrawer = ({ children, isActive, className }: CssDrawerProps) => {
  const drawer = useRef<HTMLDivElement>(null)
  return (
    <Drawer
      flow="column"
      isActive={isActive}
      ref={drawer}
      maxHeight={drawer?.current?.scrollHeight}
      className={className}
    >
      {children}
    </Drawer>
  )
}

type DrawerProps = {
  maxHeight?: number
  isActive?: boolean
}

export const Drawer = styled(FlexBox)<DrawerProps>`
  position: relative;
  max-height: ${({ isActive, maxHeight }) => (isActive ? `${maxHeight}px` : '0px')};
  overflow: hidden;
  transition: max-height ${transitions.timings.loading} ${transitions.easing};
  margin-bottom: ${({ isActive }) => (isActive ? sizes(4) : '0px')};
`

export const StyledSvgActionChevronT = styled(SvgActionChevronT, {
  shouldForwardProp: isPropValid,
})<{ isDrawerActive: boolean }>`
  transform: rotate(${({ isDrawerActive }) => (!isDrawerActive ? '-180deg' : '0deg')});
  transition: transform ${cVar('animationTransitionMedium')};
`
