import { Button } from '@/shared/components'
import styled from '@emotion/styled'

export const Wrapper = styled.div`
  max-width: calc(1440px - 72px - 64px);
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-top: 64px;
  justify-content: space-between;
`
export const Form = styled.form`
  margin-top: 70px;
  position: relative;
  width: 100%;
  max-width: 580px;
  height: 100%;
`

export const StyledButton = styled(Button)`
  display: block;
  cursor: pointer;
  position: absolute;
  right: 0;
  bottom: 0;
`
