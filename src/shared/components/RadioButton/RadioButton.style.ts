import { InnerContainer } from '@/shared/components/Checkbox/Checkbox.styles'
import { colors } from '@/shared/theme'
import styled from '@emotion/styled/'

export const StyledInnerContainer = styled(InnerContainer)`
  border-radius: 100%;
  box-shadow: ${({ selected }) => selected && `inset 0px 0px 0px 2px ${colors.black}`};
  border: ${({ selected }) => selected && `1px solid ${colors.gray[300]}`};
  padding: ${({ selected }) => selected && `0px`};
`
