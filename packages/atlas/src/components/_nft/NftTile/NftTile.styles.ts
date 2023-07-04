import styled from '@emotion/styled'

type ContainerProps = {
  fullWidth?: boolean
}

export const Container = styled.div<ContainerProps>`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '320px')};
  overflow: hidden;
`
