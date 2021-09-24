import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, media, sizes } from '@/shared/theme'

import { BaseDialog } from '../BaseDialog'

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;

  > * + * {
    margin-top: ${sizes(2)};
  }

  ${media.sm} {
    flex-direction: row-reverse;
    margin-left: auto;

    > * + * {
      margin-top: 0;
      margin-right: ${sizes(2)};
    }

    * + & {
      margin-top: 0;
    }
  }
`

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: ${sizes(6)};

  ${media.sm} {
    flex-direction: row;
    align-items: center;
  }
`

export const AdditionalActionsContainer = styled.div`
  width: 100%;
  margin-bottom: ${sizes(6)};

  ${media.sm} {
    margin-bottom: 0;
    margin-right: ${sizes(6)};
  }
`

type BaseDialogProps = { illustration: boolean }
export const StyledBaseDialog = styled(BaseDialog)<BaseDialogProps>`
  ${({ illustration }) =>
    illustration &&
    css`
      padding: 0;
      background-color: ${colors.gray[800]};
      ${ActionsContainer} {
        background-color: ${colors.gray[700]};
        padding: var(--dialog-padding);
        padding-top: 0;
      }
    `};
`
