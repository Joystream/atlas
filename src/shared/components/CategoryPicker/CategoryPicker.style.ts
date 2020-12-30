import styled from '@emotion/styled'
import Placeholder from '../Placeholder'
import ToggleButton from '../ToggleButton'
import { sizes, colors } from '@/shared/theme'

export const Container = styled.div`
  display: block;
  white-space: nowrap;
  overflow: scroll;
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
  display: inline-block;
  margin: 0 ${sizes(3)} ${sizes(3)} 0;
`

export const StyledToggleButton = styled(ToggleButton)`
  margin-right: ${sizes(3)};
`
