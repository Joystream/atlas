import styled from '@emotion/styled'
import Placeholder from '../Placeholder'
import ToggleButton from '../ToggleButton'
import { sizes, colors } from '@/shared/theme'

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const StyledPlaceholder = styled(Placeholder)`
  margin: 0 ${sizes(3)} ${sizes(3)} 0;
`

export const StyledToggleButton = styled(ToggleButton)`
  margin: 0 ${sizes(3)} ${sizes(3)} 0;
`
