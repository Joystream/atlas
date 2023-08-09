import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const PlaceholderBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(6)};
  align-items: center;
  justify-content: center;
  background-color: ${cVar('colorBackgroundMuted')};
  padding: ${sizes(6)};
`

export const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(2)};
  align-items: center;
  justify-content: center;
  max-width: 300px;
  text-align: center;
`

export const DialogContent = styled.div`
  display: grid;
  gap: ${sizes(2)};
`
