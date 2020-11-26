import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
import App from './App'
import './styles.css'
import { SENTRY_DSN } from './config/urls'

Sentry.init({ dsn: SENTRY_DSN })
ReactDOM.render(<App />, document.getElementById('root'))
