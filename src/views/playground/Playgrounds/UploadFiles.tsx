import React, { useState } from 'react'
import { useActiveUser, useUploadsManager } from '@/hooks'
import { Button, TextField } from '@/shared/components'
import { useRandomStorageProviderUrl } from '@/api/hooks'

export const UploadFiles = () => {
  const {
    activeUser: { channelId },
  } = useActiveUser()
  const { startFileUpload, uploadsState } = useUploadsManager(channelId || '')
  const randomStorageProviderUrl = useRandomStorageProviderUrl()
  const [contentId, setContentId] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) {
      return
    }
    setFile(e.target.files[0])
  }

  const handleUploadClick = () => {
    if (!file || !randomStorageProviderUrl) {
      return
    }
    startFileUpload(
      file,
      {
        contentId: contentId,
        type: 'avatar',
        parentObject: {
          type: 'channel',
          id: channelId || '',
        },
        owner: channelId || '',
      },
      randomStorageProviderUrl
    )
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
      {uploadsState.length > 0 ? (
        <pre>{JSON.stringify(uploadsState, undefined, 2)}</pre>
      ) : (
        <p style={{ color: 'rgba(255,255,255,0.3)' }}>Add file</p>
      )}
    </div>
  )
}

export default UploadFiles
