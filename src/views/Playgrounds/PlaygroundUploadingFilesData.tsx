import React, { useState, useRef } from 'react'
import { useUploadingFilesData } from '@/hooks'
import styled from '@emotion/styled'
import ImageCropDialog, { ImageCropDialogImperativeHandle } from '@/components/Dialogs/ImageCropDialog/ImageCropDialog'
import { Avatar, Text, Button } from '@/shared/components'
import { getVideoMetadata } from '@/utils/video'
import { CropData } from '@/components/Dialogs/ImageCropDialog/cropper'

export const PlaygroundUploadingFilesData = () => {
  const {
    uploadingFilesData,
    addUploadingFileData,
    updateUploadingFileStatus,
    removeUploadingFileData,
    clearUploadingFilesData,
  } = useUploadingFilesData()
  const [error, seterror] = useState<Error>()
  const [avatarImageUrl, setAvatarImageUrl] = useState<string | null>(null)
  const avatarDialogRef = useRef<ImageCropDialogImperativeHandle>(null)

  const handleAvatarConfirm = (blob: Blob, url: string, cropData: CropData) => {
    addUploadingFileData({
      hash: `${blob.size}${blob.type}`,
      storageProvider: 'storage',
      type: 'avatar',
      cropData,
      status: 'notCompleted',
    })
    setAvatarImageUrl(url)
  }

  const handleStatusChange = (id: string, currentStatus: 'completed' | 'notCompleted') => {
    if (currentStatus === 'notCompleted') {
      updateUploadingFileStatus(id, 'completed')
    } else {
      updateUploadingFileStatus(id, 'notCompleted')
    }
  }

  return (
    <div>
      <Avatar imageUrl={avatarImageUrl} editable onEditClick={() => avatarDialogRef.current?.open()} size="cover" />
      <input
        type="file"
        accept="video/*,.mkv"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (file) {
            try {
              seterror(undefined)
              const metadata = await getVideoMetadata(file)
              addUploadingFileData({
                hash: `${metadata.sizeInBytes}${metadata.duration}${metadata.width}${metadata.height}`,
                storageProvider: 'storage',
                type: 'video',
                status: 'notCompleted',
              })
            } catch (err) {
              seterror(err)
            }
          }
        }}
      ></input>
      <Text>{error?.message}</Text>
      <h2>Uploading files data:</h2>
      {uploadingFilesData.length > 0 ? (
        uploadingFilesData.map(({ id, hash, storageProvider, type, status, cropData }) => (
          <StyledDataContainer key={id}>
            <StyledButton aria-label="close dialog" onClick={() => removeUploadingFileData(id)} icon="close" />
            <p>ID: {id}</p>
            <p>Hash: {hash}</p>
            <p>Storage Provider: {storageProvider}</p>
            <p>Type: {type}</p>
            {cropData && (
              <>
                <p>Crop data:</p>
                <p>x:{cropData.x}</p>
                <p>y:{cropData.y}</p> <p>width:{cropData.width}</p> <p>height:{cropData.height}</p>
              </>
            )}
            <p>status: {status}</p>
            <Button onClick={() => handleStatusChange(id, status)}>Change status</Button>
          </StyledDataContainer>
        ))
      ) : (
        <p style={{ color: 'rgba(255,255,255,0.3)' }}>Add file</p>
      )}
      {uploadingFilesData.length > 0 && <Button onClick={clearUploadingFilesData}>Clear files</Button>}
      <ImageCropDialog imageType="avatar" onConfirm={handleAvatarConfirm} ref={avatarDialogRef} />
    </div>
  )
}

const StyledDataContainer = styled.div`
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 16px;
  margin-bottom: 16px;
`

const StyledButton = styled(Button)`
  position: absolute;
  right: 0;
  top: 0;
`

export default PlaygroundUploadingFilesData
