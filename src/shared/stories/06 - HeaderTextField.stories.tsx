import React from 'react'
import { HeaderTextField } from '../components'

export default {
  title: 'HeaderTextField',
  component: HeaderTextField,
}

export const Default = () => {
  const input = React.useRef<HTMLInputElement>(null)
  return (
    <HeaderTextField
      ref={input}
      title="Lorem ipsum dolor"
      helperText="Click to edit channel title!"
      errorText="Channel title must be at least 2 character"
    />
  )
}

export const Error = () => {
  const input = React.useRef<HTMLInputElement>(null)
  return (
    <HeaderTextField
      ref={input}
      title="Lorem ipsum dolor"
      helperText="Click to edit channel title!"
      errorText="Channel title must be at least 2 character"
      variant="error"
    />
  )
}
