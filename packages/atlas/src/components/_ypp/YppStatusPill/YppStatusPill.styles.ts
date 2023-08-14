import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${sizes(2)};
  background-color: ${cVar('colorCoreNeutral800Lighten')};
  padding: ${sizes(2)} ${sizes(4)};
  border-radius: 99px;
  width: fit-content;
`

type DotProps = {
  status: 'operational' | 'delayed' | 'stopped'
}

const getStatusDotStyles = ({ status }: DotProps) => {
  switch (status) {
    case 'delayed':
      return css`
        background: linear-gradient(#f1c804, #947b01);
        box-shadow: 0 0 0 5px #caa80280;
      `
    case 'stopped':
      return css`
        background: linear-gradient(#ff695f, #bf0c00);
        box-shadow: 0 0 0 5px #ff695f80;
      `
    case 'operational':
      return css`
        background: linear-gradient(#0ebe57, #096c34);
        box-shadow: 0 0 0 5px #0c984680;
      `
  }
}

const getDotAnimation = ({ status }: DotProps) => keyframes`
  0% {
    box-shadow: none;
  }
  
  10% {
    box-shadow: 0 0 0 3px ${status === 'stopped' ? '#ff695f80' : status === 'delayed' ? '#caa80280' : '#0c984680'};
  }
  
  20%, 100% {
    box-shadow: none;
  }
  
  
`

export const StatusDot = styled.div<DotProps>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  ${getStatusDotStyles};

  animation: 10s ease-out ${getDotAnimation} infinite;
`

export const TooltipBox = styled.div`
  padding: ${sizes(1)};
  display: grid;
  gap: ${sizes(2)};
`
