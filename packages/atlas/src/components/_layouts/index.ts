import styled from '@emotion/styled'

import { sizes } from '@/styles'

export const RowGapBlock = styled.div<{ gap?: number; align?: string; justify?: string; padding?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => sizes(props.gap ?? 1)};
  padding: ${(props) => sizes(props.padding ?? 0)};
  align-items: ${(props) => props.align ?? 'unset'};
  justify-content: ${(props) => props.justify ?? 'unset'};
`

export const ColumnGapBlock = styled.div<{ gap?: number; align?: string; justify?: string; padding?: number }>`
  display: flex;
  gap: ${(props) => sizes(props.gap ?? 1)};
  padding: ${(props) => sizes(props.padding ?? 0)};
  align-items: ${(props) => props.align ?? 'unset'};
  justify-content: ${(props) => props.justify ?? 'unset'};
`
