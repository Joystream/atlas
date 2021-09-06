import styled from '@emotion/styled'

import { colors, sizes } from '@/shared/theme'

import { Text } from '../Text'

type RadioCardLabelProps = {
  selected?: boolean
}

export const RadioCardLabel = styled.label<RadioCardLabelProps>`
  padding: ${sizes(4)};
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border: 1px solid ${({ selected }) => (selected ? colors.blue[500] : colors.gray[500])};
  transition: background-color 0.25s ease, border-color 0.25s ease;
`

export const InputAndTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${sizes(4)};
`

export const RadioCardTitle = styled(Text)`
  margin-right: ${sizes(2)};
`
