import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
import App from './App'
import './styles/fonts.css'
import { SENTRY_DSN } from './config/urls'

const initApp = () => {
  Sentry.init({ dsn: SENTRY_DSN })
  ReactDOM.render(<App />, document.getElementById('root'))
}

if (process.env.REACT_APP_ENV?.toLowerCase() !== 'production') {
  // // import mocking code only in staging/dev environments
  console.log('Loading mocking server...')
  import('@/mocking/server')
    .then(() => {
      console.log('Loaded mocking server')
    })
    .catch((e) => {
      console.log('Failed to load mocking server', e)
    })
    .finally(() => {
      initApp()
    })
} else {
  initApp()
}
