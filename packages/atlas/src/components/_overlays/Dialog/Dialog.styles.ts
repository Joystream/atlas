import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, media, sizes, zIndex } from '@/styles'

export type DialogSize = 'default' | 'compact'

type DividersProps = {
  dividers?: boolean
}

type SizeProps = {
  size: DialogSize
}

type ContentProps = {
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

export const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  z-index: ${zIndex.modals + 2};
  background-color: ${cVar('colorBackgroundStrong')};
  border-radius: ${cVar('radiusMedium')};
  box-shadow: ${cVar('effectElevation24Layer1')}, ${cVar('effectElevation24Layer2')};

  ${getDialogPaddingVariableStyles};
`

const headerDividersStyles = css`
  box-shadow: ${cVar('effectDividersBottom')};
  padding-bottom: var(--local-size-dialog-padding);
`

export const Header = styled.div<DividersProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--local-size-dialog-padding) var(--local-size-dialog-padding) 0;

  button:last-of-type {
    margin-left: ${sizes(6)};
  }

  ${media.sm} {
    button:last-of-type {
      margin-left: ${sizes(10)};
    }
  }

  ${({ dividers }) => dividers && headerDividersStyles};
`

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
`

export const Content = styled.div<ContentProps>`
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${({ noContentPadding }) => !noContentPadding && 'var(--local-size-dialog-padding)'};
`

export const footerDividersStyles = css`
  box-shadow: ${cVar('effectDividersTop')};
  padding-top: var(--local-size-dialog-padding);
`

type FooterProps = {
  'data-has-additional-actions'?: boolean
  additionalActionsNodeMobilePosition?: 'bottom' | 'top'
} & DividersProps

export const Footer = styled.div<FooterProps>`
  width: 100%;
  padding: 0 var(--local-size-dialog-padding) var(--local-size-dialog-padding);
  display: flex;
  justify-content: space-between;
  flex-direction: ${({ additionalActionsNodeMobilePosition = 'top' }) =>
    additionalActionsNodeMobilePosition === 'bottom' ? 'column-reverse' : 'column'};

  ${({ dividers }) => dividers && footerDividersStyles};

  ${media.sm} {
    flex-direction: row;
    align-items: center;
  }

  &[data-has-additional-actions='false'],
  &:not([data-has-additional-actions]) {
    justify-content: end;
  }
`

export const FooterButtonsContainer = styled.div<{
  additionalActionsNodeMobilePosition?: 'bottom' | 'top'
  stretchButtons: boolean
}>`
  margin-top: ${({ additionalActionsNodeMobilePosition = 'top' }) =>
    additionalActionsNodeMobilePosition === 'bottom' ? 0 : sizes(2)};
  margin-bottom: ${({ additionalActionsNodeMobilePosition = 'top' }) =>
    additionalActionsNodeMobilePosition === 'top' ? 0 : sizes(2)};
  display: grid;
  grid-auto-flow: column;
  gap: ${sizes(2)};
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));

  ${media.sm} {
    margin-bottom: 0;
    margin-top: 0;
    display: grid;
    ${(props) =>
      !props.stretchButtons &&
      css`
        margin-left: ${sizes(2)};
        justify-content: flex-end;
      `}

    grid-auto-columns: auto;
    grid-template-columns: unset;
  }
`
