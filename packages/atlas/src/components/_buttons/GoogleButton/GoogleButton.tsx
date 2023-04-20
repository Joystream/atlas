import styled from '@emotion/styled'
import * as React from 'react'

import { SvgGoogleSmallLogo } from '@/assets/icons/GoogleSmallLogo'

interface GoogleButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  label?: string
  disabled?: boolean
}
export const GoogleButton = ({ label, ...rest }: GoogleButtonProps) => {
  return (
    <Container as="button" {...rest}>
      <IconContainer>
        <SvgGoogleSmallLogo />
      </IconContainer>
      <span>Sign in with Google</span>
    </Container>
  )
}

const IconContainer = styled.div`
  background-color: #fff;
  height: 100%;
  display: grid;
  place-items: center;
`

const Container = styled.button`
  display: inline-flex;
  align-items: center;
  text-align: center;
  padding: 0;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 0.25);
  font-size: 16px;
  border-radius: 1px;
  transition: background-color 0.218s, border-color 0.218s, box-shadow 0.218s;
  font-family: Roboto, arial, sans-serif;
  cursor: pointer;
  user-select: none;
  background-color: #4285f4;
  color: #fff;
  border: 1px solid #4285f4;

  :hover {
    box-shadow: 0 0 3px 3px rgb(66 133 244 / 0.3);
  }

  :disabled {
    background-color: rgb(37 5 5 / 0.08);
    color: rgb(0 0 0 / 0.4);
    cursor: not-allowed;
  }

  > span {
    padding: 0 12px;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
