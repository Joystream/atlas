import styled from '@emotion/styled'
import { FC, PropsWithChildren } from 'react'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

type LegalParagraphProps = PropsWithChildren<{
  header?: boolean
  skipMargin?: boolean
}>

const _LegalParagraph = styled(Text)<LegalParagraphProps>`
  display: block;
  margin-top: ${({ header, skipMargin }) => sizes(skipMargin ? 0 : header ? 4 : 2)};

  ol {
    margin-top: 0;
  }

  a {
    text-decoration: none;
    color: ${cVar('colorTextStrong')};
  }
`
export const LegalParagraph: FC<LegalParagraphProps> = ({ header, ...props }) => (
  <_LegalParagraph
    as={header ? 'h2' : 'span'}
    variant={header ? 'h200' : 't100'}
    color={!header ? 'colorText' : undefined}
    header={header}
    {...props}
  />
)
// wrapper so we can use a specific element to render
const _StyledText = styled(Text)`
  /* stylelint-disable-line */
`

export const LegalList = styled.ol`
  margin: ${sizes(1)} 0;
  padding-left: ${sizes(6)};
`
export const LegalListItem: FC<PropsWithChildren> = (props) => (
  <_StyledText variant="t100" color="colorText" as="li" {...props} />
)

export const LegalLastUpdateText = styled(LegalParagraph)`
  font-style: italic;
`
