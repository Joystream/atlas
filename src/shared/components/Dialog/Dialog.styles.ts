import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, media, sizes } from '@/shared/theme'

export type Size = 'default' | 'compact'

type DividersProps = {
  dividers: boolean
}

type HeaderProps = {
  denseHeader: boolean
} & DividersProps

type FooterProps = {
  hasAdditionalActions: boolean
} & DividersProps

type SizeProps = {
  size: 'default' | 'compact'
}

type ContentProps = {
  hasHeader: boolean
  hasFooter: boolean
} & DividersProps

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
  background-color: ${colors.gray[700]};
  ${getDialogPaddingVariableStyles};
`

const headerDividersStyles = css`
  box-shadow: inset 0 -1px 0 0 ${colors.gray[600]};
`

const headerDenseStyles = css`
  padding-bottom: ${sizes(3)};
`

export const Header = styled.div<HeaderProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--local-size-dialog-padding);

  ${({ dividers }) => dividers && headerDividersStyles};
  ${({ denseHeader }) => denseHeader && headerDenseStyles};
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

const getContentTopPaddingStyles = ({ hasHeader, dividers }: ContentProps) =>
  dividers || !hasHeader
    ? css`
        padding-top: var(--local-size-dialog-padding);
      `
    : null

const getContentBottomPaddingStyles = ({ hasFooter, dividers }: ContentProps) =>
  dividers || !hasFooter
    ? css`
        padding-bottom: var(--local-size-dialog-padding);
      `
    : null

const getContentPaddingStyles = (props: ContentProps) => css`
  ${getContentTopPaddingStyles(props)};
  ${getContentBottomPaddingStyles(props)};
`

export const Content = styled.div<ContentProps>`
  overflow-y: auto;
  overflow-x: hidden;
  padding-left: var(--local-size-dialog-padding);
  padding-right: var(--local-size-dialog-padding);

  /* introduce minimal height so that the scrollbar doesn't show up when not needed */
  min-height: 20px;

  ${getContentPaddingStyles};
`

export const footerDividersStyles = css`
  box-shadow: inset 0 1px 0 0 ${colors.gray[600]};
`

export const Footer = styled.div<FooterProps>`
  padding: var(--local-size-dialog-padding);
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: auto;
  gap: ${sizes(2)};

  ${({ dividers }) => dividers && footerDividersStyles};

  ${media.sm} {
    grid-auto-flow: column;
    grid-auto-columns: 1fr auto;
    align-items: center;
  }
`

export const FooterButtonsContainer = styled.div`
  display: grid;
  gap: ${sizes(2)};

  ${media.sm} {
    grid-auto-flow: column;
    grid-auto-columns: auto;
    justify-content: end;

    > :first-of-type {
      order: 2;
    }
  }
`
