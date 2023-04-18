import * as React from 'react'
import _GoogleButton from 'react-google-button'

interface GoogleButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  type?: 'dark' | 'light'
  disabled?: boolean
}
export const GoogleButton = (props: GoogleButtonProps) => {
  return <_GoogleButton {...props} />
}
