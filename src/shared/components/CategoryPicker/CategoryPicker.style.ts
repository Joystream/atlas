import styled from '@emotion/styled'
import Placeholder from '../Placeholder'
import ToggleButton from '../ToggleButton'
import { sizes, colors } from '@/shared/theme'

export const Container = styled.div`
  display: -webkit-box;
  white-space: nowrap;
  overflow: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  > * {
    &:first-child {
      margin-left: var(--global-horizontal-padding);
    }
    &:last-child {
      margin-right: var(--global-horizontal-padding);
    }
  }
`

export const StyledPlaceholder = styled(Placeholder)`
  margin: 0 ${sizes(3)} ${sizes(3)} 0;
`

export const StyledToggleButton = styled(ToggleButton)`
  margin: 0 ${sizes(3)} ${sizes(3)} 0;
`
