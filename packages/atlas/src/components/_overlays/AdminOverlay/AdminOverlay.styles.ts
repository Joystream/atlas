import styled from '@emotion/styled'

import { Tabs } from '@/components/Tabs'
import { Button } from '@/components/_buttons/Button'
import { oldColors } from '@/styles'

export const Container = styled.div`
  position: fixed;
  top: 80px;
  right: 32px;
  width: 400px;
  background-color: ${oldColors.gray[600]};
  z-index: 1000;
  border-radius: 8px;
  padding: 32px 16px;
  opacity: 0.5;
  transition: opacity 200ms ease-in-out;

  :hover {
    opacity: 0.95;
  }
`

export const CloseButton = styled(Button)`
  position: absolute;
  top: 4px;
  right: 4px;
`

export const HorizontalSpacedContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  > * + * {
    margin-left: 16px;
  }
`

export const VerticalSpacedContainer = styled.div<{ topMargin?: boolean }>`
  display: flex;
  flex-direction: column;
  margin-top: ${({ topMargin }) => (topMargin ? '16px' : 0)};

  > * + * {
    margin-top: 16px;
  }
`

export const StyledTabs = styled(Tabs)`
  margin-top: 12px;
`

export const CustomNodeUrlWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > * + * {
    margin-left: 16px;
  }
`
