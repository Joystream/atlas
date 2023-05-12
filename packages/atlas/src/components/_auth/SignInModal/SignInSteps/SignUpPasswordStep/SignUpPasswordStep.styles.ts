import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { sizes } from '@/styles'

export const PasswordRequirementsWrapper = styled.section`
  display: grid;
  gap: ${sizes(4)};
`

export const PasswordRequirementsList = styled.ul`
  padding: 0;
  margin: 0;
  list-style-type: none;
  display: grid;
  gap: ${sizes(4)};
`

export const PasswordRequirementItem = styled(Text)`
  display: flex;
  align-items: center;
  gap: ${sizes(2)};
`
