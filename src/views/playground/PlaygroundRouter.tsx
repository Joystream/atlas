import React from 'react'
import { Route, Routes } from 'react-router'
import { PlaygroundDrafts, PlaygroundValidationForm, VideoMetaData, PlaygroundUploadingFilesData } from './Playgrounds'

const PlaygroundRouter = () => {
  return (
    <Routes>
      <Route key="validation-form" path="/validation-form" element={<PlaygroundValidationForm />} />
      <Route key="drafts" path="/drafts" element={<PlaygroundDrafts />} />
      <Route key="metadata" path="/video-metadata" element={<VideoMetaData />} />
      <Route key="uploading-files-data" path="/uploading-files-data" element={<PlaygroundUploadingFilesData />} />
    </Routes>
  )
}

export default PlaygroundRouter
