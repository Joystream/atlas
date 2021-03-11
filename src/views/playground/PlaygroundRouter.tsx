import React from 'react'
import { Route, Routes } from 'react-router'
import { PlaygroundDrafts, PlaygroundValidationForm, VideoMetaData } from './Playgrounds'

const PlaygroundRouter = () => {
  return (
    <Routes>
      <Route key="validation-form" path="/validation-form" element={<PlaygroundValidationForm />} />
      <Route key="drafts" path="/drafts" element={<PlaygroundDrafts />} />
      <Route key="metadata" path="/video-metadata" element={<VideoMetaData />} />
    </Routes>
  )
}

export default PlaygroundRouter
