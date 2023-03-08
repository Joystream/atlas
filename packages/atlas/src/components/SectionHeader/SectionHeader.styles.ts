import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

import { Text } from '../Text'
import { Input } from '../_inputs/Input'

export const SectionHeaderWrapper = styled.header<SectionHeaderWrapperProps>`
  display: grid;
  grid-template-columns: auto max-content max-content;
  align-items: flex-start;
  gap: ${sizes(4)};
  box-shadow: ${({ underline }) => (underline ? `inset 0 -1px 0 ${cVar('colorBorderMutedAlpha')}` : 'unset')}; ;
`

export const SectionTitle = styled(Text)`
  align-self: center;
`

export const TabsWrapper = styled.div`
  min-width: 0;
  max-width: max-content;
`

export const SearchInput = styled(Input)`
  max-width: 100%;

  input {
    width: 240px;
  }
`

type SectionHeaderWrapperProps = {
  underline: boolean
}

export const SectionSearchWrapper = styled.div`
  justify-self: flex-start;
`
