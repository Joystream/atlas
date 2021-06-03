import React, { useCallback, useState, useRef } from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router'
import { useUploadsManager, useAuthorizedUser, useDialog } from '@/hooks'
import { useRandomStorageProviderUrl } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import { formatBytes } from '@/utils/size'
import { computeFileHash } from '@/utils/hashing'
import {
  FileLineContainer,
  FileLinePoint,
  FileLineLastPoint,
  FileStatusContainer,
  FileInfoContainer,
  FileInfoType,
  StatusMessage,
  ProgressbarContainer,
} from './AssetLine.style'
import { AssetUploadWithProgress } from '@/hooks/useUploadsManager/types'
import { ImageCropDialog, ImageCropDialogImperativeHandle } from '@/components'
import { Text, CircularProgressbar, Button } from '@/shared/components'
import { SvgAlertError, SvgAlertSuccess, SvgGlyphFileImage, SvgGlyphFileVideo, SvgGlyphUpload } from '@/shared/icons'
import { LiaisonJudgement } from '@/api/queries'

type AssetLineProps = {
  isLast?: boolean
  asset: AssetUploadWithProgress
}

const AssetLine: React.FC<AssetLineProps> = ({ isLast = false, asset }) => {
  const navigate = useNavigate()
  const { activeChannelId } = useAuthorizedUser()
  const { startFileUpload } = useUploadsManager(activeChannelId)
  const { getRandomStorageProviderUrl } = useRandomStorageProviderUrl()

  const thumbnailDialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const avatarDialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropDialogImperativeHandle>(null)

  const [openDifferentFileDialog, closeDifferentFileDialog] = useDialog({
    title: 'Different file was selected!',
    description: `We detected that you selected a different file than the one you uploaded previously. Select the same file to continue the upload or edit ${
      asset.parentObject.type === 'channel' ? 'your channel' : 'the video'
    } to use the new file.`,
    variant: 'warning',
    onSecondaryButtonClick: () => {
      if (asset.parentObject.type === 'video') {
        navigate(absoluteRoutes.studio.editVideo())
      }
      if (asset.parentObject.type === 'channel') {
        navigate(absoluteRoutes.studio.editChannel())
      }
      closeDifferentFileDialog()
    },
    onPrimaryButtonClick: () => {
      openFileSelect()
      closeDifferentFileDialog()
    },
    primaryButtonText: 'Reselect file',
    secondaryButtonText: `Edit ${asset.parentObject.type === 'channel' ? 'channel' : 'video'}`,
    exitButton: false,
  })

  const onDrop: DropzoneOptions['onDrop'] = useCallback(
    async (acceptedFiles) => {
      const [file] = acceptedFiles
      const fileHash = await computeFileHash(file)
      if (fileHash !== asset.ipfsContentId) {
        openDifferentFileDialog()
      } else {
        const randomStorageProviderUrl = getRandomStorageProviderUrl()
        if (!randomStorageProviderUrl) {
          return
        }
        startFileUpload(
          file,
          {
            contentId: asset.contentId,
            owner: asset.owner,
            parentObject: {
              type: asset.parentObject.type,
              id: asset.parentObject.id,
            },
            type: asset.type,
          },
          randomStorageProviderUrl,
          {
            isReUpload: true,
          }
        )
      }
    },
    [
      asset.contentId,
      asset.ipfsContentId,
      asset.owner,
      asset.parentObject.id,
      asset.parentObject.type,
      asset.type,
      getRandomStorageProviderUrl,
      openDifferentFileDialog,
      startFileUpload,
    ]
  )

  const { getRootProps, getInputProps, open: openFileSelect } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    noClick: true,
    noKeyboard: true,
  })

  const isVideo = asset.type === 'video'
  const fileTypeText = isVideo ? 'Video file' : `${asset.type.charAt(0).toUpperCase() + asset.type.slice(1)} image`

  const handleChangeHost = () => {
    const randomStorageProviderUrl = getRandomStorageProviderUrl()
    if (!randomStorageProviderUrl) {
      return
    }
    startFileUpload(
      null,
      {
        contentId: asset.contentId,
        owner: asset.owner,
        parentObject: {
          type: asset.parentObject.type,
          id: asset.parentObject.id,
        },
        type: asset.type,
      },
      randomStorageProviderUrl,
      {
        changeHost: true,
      }
    )
  }

  const handleCropConfirm = async (croppedBlob: Blob) => {
    const fileHash = await computeFileHash(croppedBlob)
    if (fileHash !== asset.ipfsContentId) {
      openDifferentFileDialog()
    } else {
      const randomStorageProviderUrl = getRandomStorageProviderUrl()
      if (!randomStorageProviderUrl) {
        return
      }
      startFileUpload(
        croppedBlob,
        {
          contentId: asset.contentId,
          owner: asset.owner,
          parentObject: {
            type: asset.parentObject.type,
            id: asset.parentObject.id,
          },
          type: asset.type,
        },
        randomStorageProviderUrl,
        {
          isReUpload: true,
        }
      )
    }
  }

  const dimension =
    asset.dimensions?.width && asset.dimensions.height
      ? `${Math.floor(asset.dimensions.width)}x${Math.floor(asset.dimensions.height)}`
      : ''
  const size = formatBytes(asset.size)

  const assetsDialogs = {
    avatar: avatarDialogRef,
    cover: coverDialogRef,
    thumbnail: thumbnailDialogRef,
  }
  const reselectFile = () => {
    asset.type === 'video' ? openFileSelect() : assetsDialogs[asset.type].current?.open(undefined, asset.imageCropData)
  }

  const renderStatusMessage = (asset: AssetUploadWithProgress) => {
    if (asset.lastStatus === 'reconnecting') {
      return 'Trying to reconnect...'
    }
    if (asset.lastStatus === 'reconnectionError') {
      return (
        <Button size="small" variant="secondary" icon={<SvgGlyphUpload />} onClick={handleChangeHost}>
          Change host
        </Button>
      )
    }
    if (
      asset.lastStatus === 'error' ||
      (asset.lastStatus === 'inProgress' && asset.progress === 0 && asset.liaisonJudgement === LiaisonJudgement.Pending)
    ) {
      return (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Button size="small" variant="secondary" icon={<SvgGlyphUpload />} onClick={reselectFile}>
            Reconnect file
          </Button>
        </div>
      )
    }
  }

  const renderStatusIndicator = (asset: AssetUploadWithProgress) => {
    if (asset.lastStatus === 'completed') {
      return <SvgAlertSuccess />
    }
    if (asset.lastStatus === 'error') {
      return <SvgAlertError />
    }
    return (
      <ProgressbarContainer>
        <CircularProgressbar value={asset.progress} />
      </ProgressbarContainer>
    )
  }

  return (
    <>
      <FileLineContainer isLast={isLast}>
        {isLast ? <FileLineLastPoint /> : <FileLinePoint />}
        <FileStatusContainer>{renderStatusIndicator(asset)}</FileStatusContainer>
        <FileInfoContainer>
          <FileInfoType>
            {isVideo ? <SvgGlyphFileVideo /> : <SvgGlyphFileImage />}
            <Text variant="body2">{fileTypeText}</Text>
          </FileInfoType>
          <Text variant="body2">{dimension}</Text>
          <Text>{size}</Text>
        </FileInfoContainer>
        <StatusMessage variant="subtitle2">{renderStatusMessage(asset)}</StatusMessage>
      </FileLineContainer>
      <ImageCropDialog ref={thumbnailDialogRef} imageType="videoThumbnail" onConfirm={handleCropConfirm} />
      <ImageCropDialog ref={avatarDialogRef} imageType="avatar" onConfirm={handleCropConfirm} />
      <ImageCropDialog ref={coverDialogRef} imageType="cover" onConfirm={handleCropConfirm} />
    </>
  )
}

export default AssetLine
