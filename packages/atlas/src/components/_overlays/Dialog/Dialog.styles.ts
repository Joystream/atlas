import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { media, oldColors, sizes } from '@/styles'

export type DialogSize = 'default' | 'compact'

type DividersProps = {
  dividers: boolean
}

type SizeProps = {
  size: 'default' | 'compact'
}

type ContentProps = {
  denseHeader: boolean
  noContentPadding?: boolean
}

const getDialogPaddingVariableStyles = ({ size }: SizeProps) =>
  size === 'default'
    ? css`
        --local-size-dialog-padding: ${sizes(4)};

        ${media.sm} {
          --local-size-dialog-padding: ${sizes(6)};
        }
      `
    : css`
        --local-size-dialog-padding: ${sizes(4)};
      `

export const DialogContainer = styled.div<SizeProps>`
  display: flex;
  flex-direction: column;
  width: 480px;
  max-width: 90vw;
  max-height: 640px;
  overflow: hidden;
  background-color: ${oldColors.gray[700]};
  ${getDialogPaddingVariableStyles};
`

const headerDividersStyles = css`
  box-shadow: inset 0 -1px 0 0 ${oldColors.gray[600]};
  padding-bottom: var(--local-size-dialog-padding);
`

export const Header = styled.div<DividersProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--local-size-dialog-padding) var(--local-size-dialog-padding) 0;

  ${({ dividers }) => dividers && headerDividersStyles};
`

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
`

export const HeaderIconContainer = styled.div`
  max-height: 32px;
  max-width: 32px;
  margin-bottom: ${sizes(4)};
`

const getDenseHeaderContentStyles = ({ denseHeader, noContentPadding }: ContentProps) =>
  denseHeader &&
  !noContentPadding &&
  css`
    padding-top: ${sizes(3)};
  `

export const Content = styled.div<ContentProps>`
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${({ noContentPadding }) => !noContentPadding && 'var(--local-size-dialog-padding)'};
  ${getDenseHeaderContentStyles};
`

export const footerDividersStyles = css`
  box-shadow: inset 0 1px 0 0 ${oldColors.gray[600]};
  padding-top: var(--local-size-dialog-padding);
`

type FooterProps = {
  hasAdditionalActions: boolean
  additionalActionsNodeMobilePosition: 'bottom' | 'top'
} & DividersProps

export const Footer = styled.div<FooterProps>`
  padding: 0 var(--local-size-dialog-padding) var(--local-size-dialog-padding);
  display: flex;
  justify-content: space-between;
  flex-direction: ${({ additionalActionsNodeMobilePosition }) =>
    additionalActionsNodeMobilePosition === 'bottom' ? 'column-reverse' : 'column'};

  ${({ dividers }) => dividers && footerDividersStyles};

  ${media.sm} {
    flex-direction: row-reverse;
    align-items: center;
  }
`

export const FooterButtonsContainer = styled.div<{ additionalActionsNodeMobilePosition: 'bottom' | 'top' }>`
  margin-top: ${({ additionalActionsNodeMobilePosition }) =>
    additionalActionsNodeMobilePosition === 'bottom' ? 0 : sizes(2)};
  margin-bottom: ${({ additionalActionsNodeMobilePosition }) =>
    additionalActionsNodeMobilePosition === 'top' ? 0 : sizes(2)};
  display: flex;
  flex-direction: column-reverse;

  ${media.sm} {
    margin-bottom: 0;
    margin-top: 0;
    margin-left: ${sizes(2)};
    display: grid;
    gap: ${sizes(2)};
    grid-auto-flow: column;
    justify-content: flex-end;
    grid-auto-columns: auto;
  }
`
export const StyledPrimaryButton = styled(Button)`
  margin-bottom: ${sizes(2)};
  ${media.sm} {
    margin-bottom: unset;
  }
`
