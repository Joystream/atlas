import styled from '@emotion/styled'

import { getMaskImage } from '@/components/Tabs/Tabs.styles'
import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

import { ToggleButtonGroupProps } from './ToggleButtonGroup'

export const Container = styled.div<{ size: ToggleButtonGroupProps<''>['size'] }>`
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  padding: ${sizes(1)};
  gap: ${sizes(1)};
  border: 1px solid ${cVar('colorBorderMutedAlpha')};
  align-items: center;
  border-radius: ${cVar('radiusSmall')};
  width: ${(props) => (props.size === 'large' ? 'fit-content' : '320px')};
`

export const OptionWrapper = styled.div<{
  shadowsVisible: {
    left: boolean
    right: boolean
  }
}>`
  display: flex;
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
`

export const Anchor = styled.div`
  position: relative;
  height: 100%;
`
