import React, { useState, useRef } from 'react'
import { useUploadingFilesData } from '@/hooks'
import styled from '@emotion/styled'
import { ImageCropDialog, ImageCropDialogImperativeHandle } from '@/components/'
import { Avatar, Text, Button, IconButton } from '@/shared/components'
import { getVideoMetadata } from '@/utils/video'
import { ImageCropData } from '@/types/cropper'

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

  const handleAvatarConfirm = (blob: Blob, url: string, cropData: ImageCropData) => {
    addUploadingFileData({
      hash: `${blob.size}${blob.type}`,
      storageProvider: 'storage',
      type: 'avatar',
      imageCropData: cropData,
      size: blob.size,
      parentObject: {
        type: 'channel',
        id: `${blob.size}${blob.size}${blob.size}${blob.size}`,
      },
      status: 'inProgress',
    })
    setAvatarImageUrl(url)
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
                size: metadata.sizeInBytes,
                parentObject: {
                  type: 'channel',
                  id: `${metadata.sizeInBytes}${metadata.sizeInBytes}${metadata.sizeInBytes}${metadata.sizeInBytes}`,
                },
                status: 'inProgress',
              })
            } catch (err) {
              seterror(err)
            }
          }
        }}
      />
      <Text>{error?.message}</Text>
      <h2>Uploading files data:</h2>
      {uploadingFilesData.length > 0 ? (
        uploadingFilesData.map(({ id, hash, storageProvider, type, status, imageCropData }) => (
          <StyledDataContainer key={id}>
            <StyledButton aria-label="close dialog" onClick={() => removeUploadingFileData(id)} icon="close" />
            <p>ID: {id}</p>
            <p>Hash: {hash}</p>
            <p>Storage Provider: {storageProvider}</p>
            <p>Type: {type}</p>
            {imageCropData && (
              <>
                <p>Crop data:</p>
                <p>left:{imageCropData.left}</p>
                <p>top:{imageCropData.top}</p> <p>width:{imageCropData.width}</p> <p>height:{imageCropData.height}</p>
              </>
            )}
            <p>status: {status}</p>
            <Button onClick={() => updateUploadingFileStatus(id, 'completed')}>Change status</Button>
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

const StyledButton = styled(IconButton)`
  position: absolute;
  right: 0;
  top: 0;
`

export default PlaygroundUploadingFilesData
