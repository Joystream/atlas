import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { DisplaySnackbarArgs, Snackbars, useSnackbar } from '@/providers/snackbars'

import { Button } from '../_buttons/Button'

const props: DisplaySnackbarArgs = {
  title: 'snackbar',
  description: 'description test',
  actionText: 'action text',
  iconType: 'error',
  timeout: 50,
}

const TestElement = () => {
  const { displaySnackbar } = useSnackbar()
  return (
    <Button size="small" onClick={() => displaySnackbar({ ...props })}>
      Show snackbar
    </Button>
  )
}

describe('Snackar', async () => {
  it('Display snackbar', async () => {
    const { getByText } = render(<TestElement />, {
      wrapper: ({ children }) => (
        <BrowserRouter>
          {children}
          <Snackbars />
        </BrowserRouter>
      ),
    })

    fireEvent.click(screen.getByRole('button'))

    getByText(props.title ?? '')
    getByText(props.description ?? '')
    getByText(props.actionText ?? '')

    await waitForElementToBeRemoved(() => getByText(props.title ?? ''))
  })
})
