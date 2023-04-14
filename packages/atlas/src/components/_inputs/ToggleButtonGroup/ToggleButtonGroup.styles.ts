import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { cVar, sizes, zIndex } from '@/styles'
import { MaskProps, getMaskImage } from '@/utils/styles'

export type ContainerWidth = 'auto' | 'fixed' | 'fluid'

const getContainerMaxWidth = (width: ContainerWidth) => {
  switch (width) {
    case 'fluid':
      return 'unset'
    case 'auto':
      return 'fit-content'
    case 'fixed':
      return '320px'
  }
}

export const Container = styled.div<{ width: ContainerWidth }>`
  display: flex;
  padding: ${sizes(1)};
  gap: ${sizes(1)};
  box-shadow: inset 0 0 0 1px ${cVar('colorBorderMutedAlpha')};
  border-radius: ${cVar('radiusSmall')};
  max-width: ${(props) => getContainerMaxWidth(props.width)};
`

export const OptionWrapper = styled.div<MaskProps>`
  display: flex;
  flex: 1;
  gap: ${sizes(1)};
  width: auto;
  overflow: auto;
  scrollbar-width: none;
  position: relative;
  ${getMaskImage};

  ::-webkit-scrollbar {
    display: none;
  }
`

export const Label = styled(Text)`
  padding: ${sizes(2)};
  align-self: center;
`

export const Anchor = styled.div`
  position: relative;
  height: 100%;
`

export const ContentWrapper = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  width: 100%;
`

export const StyledButton = styled(Button)`
  pointer-events: all;
  position: absolute;
  z-index: ${zIndex.nearOverlay};
`

export const ButtonLeft = styled(StyledButton)<{ 'data-right'?: boolean }>`
  left: 0;
`

export const ButtonRight = styled(StyledButton)<{ 'data-right'?: boolean }>`
  right: 0;
`
