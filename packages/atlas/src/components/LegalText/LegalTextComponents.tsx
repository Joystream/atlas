import styled from '@emotion/styled'
import { FC, PropsWithChildren } from 'react'

import { Text } from '@/components/Text'
import { sizes } from '@/styles'

const _LegalParagraph = styled(Text)`
  margin-top: ${sizes(6)};

  ol + & {
    margin-top: 0;
  }
`

type LegalParagraphProps = PropsWithChildren<{ header?: boolean }>
export const LegalParagraph: FC<LegalParagraphProps> = ({ header, ...props }) => (
  <_LegalParagraph variant={header ? 'h300' : 't200'} color={!header ? 'default' : undefined} {...props} />
)
// wrapper so we can use a specific element to render
const _StyledText = styled(Text)`
  /* stylelint-disable-line */
`
export const LegalListItem: FC<PropsWithChildren> = (props) => (
  <_StyledText variant="t200" color="default" as="li" {...props} />
)

export const LegalLastUpdateText = styled(LegalParagraph)`
  font-style: italic;
`
