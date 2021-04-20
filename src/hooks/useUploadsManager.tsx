import React, { useCallback, useContext } from 'react'

type Upload = {
  file: string
  progress: 'pending'
}

type UploadManagerValue = {
  upload: () => void
  uploads: Upload[]
}

const UploadManagerContext = React.createContext<UploadManagerValue | undefined>(undefined)
UploadManagerContext.displayName = 'UploadManagerContext'

export const UploadManagerProvider: React.FC = ({ children }) => {
  const upload = useCallback(() => {
    console.log('do something here')
  }, [])

  return (
    <UploadManagerContext.Provider
      value={{
        upload,
        uploads: [],
      }}
    >
      {children}
    </UploadManagerContext.Provider>
  )
}

export const useUploadsManager = () => {
  const ctx = useContext(UploadManagerContext)
  if (ctx === undefined) {
    throw new Error('useUploadsManager must be used within a UploadManagerProvider')
  }
  return ctx
}
