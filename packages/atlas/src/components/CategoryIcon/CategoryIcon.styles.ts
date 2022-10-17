import styled from '@emotion/styled'

export const Icon = styled.img<{ url?: string; color?: string }>`
  background-color: ${({ color }) => color};
  mask: url(${({ url }) => url}) no-repeat center;
  width: 24px;
  height: 24px;
`
