import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { ListItem } from '@/components/ListItem'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export const TypeWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const TypeIconWrapper = styled.div`
  background-color: ${cVar('colorBackgroundAlpha')};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: ${sizes(2)};
  border-radius: 50%;
`

export const StyledNumberFormat = styled(NumberFormat)`
  display: block;
`

export const JoyAmountWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

export const StyledJoyTokenIcon = styled(JoyTokenIcon)<{ error: boolean }>`
  path {
    fill: ${({ error }) => (error ? cVar('colorTextError') : undefined)};
  }
`

export const JoystreamSvgWrapper = styled.div`
  height: 31px;
  width: 31px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  overflow: hidden;
  background-color: #5d5d5d;

  svg {
    height: 20px;

    g {
      fill: ${cVar('colorCoreBaseWhite')};
    }
  }
`

export const StyledLink = styled(Link)`
  text-decoration: none;
`

export const SenderItem = styled(ListItem)`
  padding-left: 0;

  & span[color] {
    color: ${cVar('colorTextStrong')};
  }
`

export const TextWrapper = styled.div`
  display: inline-flex;
  overflow: hidden;
  width: 100%;

  button > * {
    width: max-content;
  }
`

export const DialogText = styled(Text)`
  text-align: justify;
`
