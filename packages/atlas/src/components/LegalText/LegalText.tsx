import styled from '@emotion/styled'
import { FC, PropsWithChildren } from 'react'

import { Text } from '@/components/Text'

const StyledLegalText = styled(Text)`
  white-space: pre-wrap;
`

export const LegalText: FC<PropsWithChildren> = (props) => (
  <StyledLegalText variant="t100" color="colorText" as="pre" {...props} />
)
