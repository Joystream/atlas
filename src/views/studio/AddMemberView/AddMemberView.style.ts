import { Button } from '@/shared/components'
import { breakpoints } from '@/shared/theme'
import styled from '@emotion/styled'

export const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;
  margin-top: 64px;
  justify-content: space-between;
`
export const Form = styled.form`
  margin-top: 20px;
  position: relative;
  width: 100%;
  max-width: 580px;
  height: initial;

  @media screen and (min-width: ${breakpoints.medium}) {
    left: 0;
    height: calc(100vh - 300px);
    width: 100%;
  }
`

export const StyledButton = styled(Button)`
  display: block;
  cursor: pointer;
  margin-top: 50px;
  margin-left: auto;
`
