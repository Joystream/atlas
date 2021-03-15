import { DraftsProvider } from '@/hooks'
import React from 'react'
import StudioRouter from './StudioRouter'

const StudioView = () => {
  return (
    <>
      <DraftsProvider>
        <StudioRouter />
      </DraftsProvider>
    </>
  )
}

export default StudioView
