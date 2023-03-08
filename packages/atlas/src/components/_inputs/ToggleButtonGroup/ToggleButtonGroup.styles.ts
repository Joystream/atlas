import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { cVar, sizes, zIndex } from '@/styles'
import { getMaskImage } from '@/utils/styles'

export const Container = styled.div<{ width: 'auto' | 'fixed' }>`
  display: flex;
  padding: ${sizes(1)};
  gap: ${sizes(1)};
  box-shadow: inset 0 0 0 1px ${cVar('colorBorderMutedAlpha')};
  border-radius: ${cVar('radiusSmall')};
  max-width: ${(props) => (props.width === 'auto' ? 'fit-content' : '320px')};
`

export const OptionWrapper = styled.div<{
  shadowsVisible: {
    left: boolean
    right: boolean
  }
}>`
  display: flex;
  flex: 1;
  gap: ${sizes(1)};
  width: auto;
  overflow: auto;
  scrollbar-width: none;
  position: relative;
  ${(props) =>
    getMaskImage({
      shadowsVisible: props.shadowsVisible,
      'data-underline': false,
    })};

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
