import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'
import { getMaskImage } from '@/utils/styles'

export const Container = styled.div<{ type: 'contain' | 'stretch' }>`
  display: flex;
  padding: ${sizes(1)};
  gap: ${sizes(1)};
  border: 1px solid ${cVar('colorBorderMutedAlpha')};
  border-radius: ${cVar('radiusSmall')};
  max-width: ${(props) => (props.type === 'stretch' ? 'fit-content' : '320px')};
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
