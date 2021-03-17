import React from 'react'
import { Route, Routes } from 'react-router'
import {
  PlaygroundDrafts,
  PlaygroundValidationForm,
  VideoMetaData,
  PlaygroundUploadingFilesData,
  PlaygroundMemberChannel,
} from './Playgrounds'

const PlaygroundRouter = () => {
  return (
    <Routes>
      <Route key="validation-form" path="/validation-form" element={<PlaygroundValidationForm />} />
      <Route key="drafts" path="/drafts" element={<PlaygroundDrafts />} />
      <Route key="metadata" path="/video-metadata" element={<VideoMetaData />} />
      <Route key="uploading-files-data" path="/uploading-files-data" element={<PlaygroundUploadingFilesData />} />
      <Route key="member-active-channel" path="/member-active-channel" element={<PlaygroundMemberChannel />} />
    </Routes>
  )
}

export default PlaygroundRouter
