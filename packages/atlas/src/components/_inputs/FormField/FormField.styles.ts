import styled from '@emotion/styled'

import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { sizes } from '@/styles'

type DenseProps = {
  dense?: boolean
}

export const SwitchLabel = styled.label`
  display: inline-flex;
  cursor: pointer;
`

export const SwitchTitle = styled(Text)`
  margin-left: ${sizes(3)};
`

export const FormFieldWrapper = styled.div<DenseProps>`
  margin-top: ${({ dense }) => sizes(dense ? 4 : 10)};
  width: 100%;
`

export const FormFieldHeader = styled.header`
  display: flex;
  align-items: center;
  width: 85%;
  word-wrap: break-word;
`

export const StyledInformation = styled(Information)`
  margin-left: ${sizes(1)};
`

export const OptionalText = styled(Text)`
  margin-left: ${sizes(4)};
`

export const FormFieldDescription = styled(Text)`
  width: 85%;
  padding: ${sizes(2)} 0;
  word-wrap: break-word;
`

export const ChildrenWrapper = styled.div`
  margin-top: ${sizes(4)};
`
