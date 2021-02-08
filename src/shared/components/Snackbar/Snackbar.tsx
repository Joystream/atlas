import { Global } from '@emotion/react'
import React from 'react'
import Icon from '../Icon'
import { SnackbarButton, SnackbarParagraph, snackbarTransitions, SnackbarWrapper } from './Snackbar.style'

export type SnackbarProps = {
  variant?: 'error' | 'success' | 'info'
  message: string
  buttonText?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const SnackbarComponent: React.ForwardRefRenderFunction<HTMLDivElement, SnackbarProps> = (
  { variant = 'info', message, buttonText = 'Ok', onClick },
  ref
) => {
  return (
    <>
      <Global styles={snackbarTransitions} />
      <SnackbarWrapper ref={ref}>
        <SnackbarParagraph>
          <Icon name={variant} />
          {message}
        </SnackbarParagraph>
        <SnackbarButton onClick={onClick}>{buttonText}</SnackbarButton>
      </SnackbarWrapper>
    </>
  )
}

const Snackbar = React.forwardRef(SnackbarComponent)

Snackbar.displayName = 'Snackbar'

export default Snackbar
