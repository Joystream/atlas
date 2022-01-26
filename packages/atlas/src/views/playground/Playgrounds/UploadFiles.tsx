import React, { useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { TextField } from '@/components/_inputs/TextField'
import { useStartFileUpload, useUploadsStore } from '@/providers/uploadsManager'
import { useAuthorizedUser } from '@/providers/user'

export const UploadFiles = () => {
  const { activeChannelId } = useAuthorizedUser()
  const uploads = useUploadsStore((state) => state.uploads)
  const startFileUpload = useStartFileUpload()
  const [contentId, setContentId] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) {
      return
    }
    setFile(e.target.files[0])
  }

  const handleUploadClick = () => {
    if (!file) {
      return
    }
    startFileUpload(file, {
      id: contentId,
      type: 'avatar',
      parentObject: {
        type: 'channel',
        id: activeChannelId,
      },
      owner: activeChannelId,
    })
  }

  return (
    <div>
      <TextField
        label="Content ID"
        helperText="Must be an existing content ID"
        value={contentId}
        onChange={(e) => setContentId(e.target.value)}
      />
      <input type="file" onChange={handleFileChange} />
      <Button onClick={handleUploadClick}>Start upload</Button>
      <h2>Uploading files data:</h2>
      {uploads.length > 0 ? (
        <pre>{JSON.stringify(uploads, undefined, 2)}</pre>
      ) : (
        <p style={{ color: 'rgba(255 255 255 / 0.3)' }}>Add file</p>
      )}
    </div>
  )
}
