import styled from '@emotion/styled'

import { cVar, sizes, transitions } from '@/styles'

export const Header = styled.div<{ progressWidth: string }>`
  background-color: ${cVar('colorBackgroundMuted')};
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: ${sizes(9)} ${sizes(8)};
  position: relative;
  overflow: hidden;

  ::after {
    content: ' ';
    display: block;
    background-color: ${cVar('colorBackgroundPrimary')};
    position: absolute;
    bottom: 0;
    height: 4px;
    left: 0;
    width: ${(props) => props.progressWidth};
  }
`

export const RowBox = styled.div<{ gap: number; wrap?: boolean }>`
  display: flex;
  gap: ${(props) => sizes(props.gap)};
  align-items: center;
  flex-wrap: ${(props) => (props.wrap ? 'wrap' : 'none')};
`

export const ColumnBox = styled.div<{ gap: number }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => sizes(props.gap)};
  width: 100%;
`

type DrawerProps = {
  maxHeight?: number
  isActive?: boolean
}

export const DetailsDrawer = styled.div<DrawerProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  top: 0;
  width: 100%;
  max-height: ${({ isActive, maxHeight }) => (isActive ? `${maxHeight}px` : '0px')};
  overflow: hidden;
  transition: max-height ${transitions.timings.loading} ${transitions.easing};
  background-color: ${cVar('colorBackgroundMuted')};
`

export const DropdownContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: ${sizes(10)};
  padding: ${sizes(4)};
`

export const ProgressBar = styled.div<{ progress: number }>`
  position: relative;
  height: 12px;
  width: 100%;
  background-color: ${cVar('colorBackground')};
  border-radius: ${sizes(8)};
  overflow: hidden;

  ::after {
    content: ' ';
    position: absolute;
    left: 0;
    height: 100%;
    background-color: ${cVar('colorBackgroundPrimary')};
    width: ${({ progress }) => `${progress}%`};
    transition: width 1s linear;
    border-radius: ${sizes(8)};
    min-width: 25px;
  }
`

export const StepCardContainer = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${sizes(6)};
  background-color: ${cVar('colorBackgroundMutedAlpha')};
  border-left: 4px solid ${(props) => (props.isActive ? cVar('colorBackgroundPrimary') : 'transparent')};
  padding: 16px;

  .step-number {
    background-color: ${(props) =>
      props.isActive ? cVar('colorBackgroundPrimary') : cVar('colorBackgroundStrongAlpha')};
  }
`

export const StepNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${cVar('colorBackgroundPrimary')};
  border-radius: 50%;
  width: 28px;
  height: 28px;
`

export const MainWrapper = styled.div`
  position: relative;
`
