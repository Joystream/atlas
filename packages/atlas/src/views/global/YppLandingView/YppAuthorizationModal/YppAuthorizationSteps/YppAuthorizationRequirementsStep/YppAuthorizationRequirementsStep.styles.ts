import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes, square } from '@/styles'

export const StyledList = styled.ul`
  margin: 0 0 ${sizes(6)} 0;
  padding-left: 0;
  display: grid;
  gap: ${sizes(4)};
  padding-right: 64px;
`

export const ListItem = styled(Text)`
  list-style: none;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: flex-start;
  gap: ${sizes(2)};
`

export const TickWrapper = styled.div<{ fulfilled: boolean }>`
  ${square('24px')};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ fulfilled }) => cVar(fulfilled ? 'colorBackgroundAlpha' : 'colorBackgroundError')};
  border-radius: 50%;
  margin-top: -2px;
`

export const Paragraph = styled.p<{ important?: boolean }>`
  margin: 0;

  ${(props) =>
    props.important &&
    css`
      color: ${cVar('colorTextCaution')};
    `}
`

export const CategoriesText = styled(Text)`
  display: block;
  margin-top: ${sizes(1)};
`
