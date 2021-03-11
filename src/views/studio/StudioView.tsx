import { DraftsProvider } from '@/hooks'
import React from 'react'
import StudioRouter from './StudioRouter'

const StudioView = () => {
  return (
    <>
      <DraftsProvider>
        <h1>Studio view here</h1>
        <StudioRouter />
      </DraftsProvider>
    </>
  )
}

export default StudioView
