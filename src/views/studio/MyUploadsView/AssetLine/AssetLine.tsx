import React, { useCallback, useRef } from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router'

import { ImageCropDialog, ImageCropDialogImperativeHandle } from '@/components'
import { absoluteRoutes } from '@/config/routes'
import { useDialog, useUploadsStore } from '@/providers'
import { AssetUpload } from '@/providers/uploadsManager/types'
import { useStartFileUpload } from '@/providers/uploadsManager/useStartFileUpload'
import { Button, CircularProgressbar, Text } from '@/shared/components'
import { SvgAlertError, SvgAlertSuccess, SvgGlyphFileImage, SvgGlyphFileVideo, SvgGlyphUpload } from '@/shared/icons'
import { computeFileHash } from '@/utils/hashing'
import { formatBytes } from '@/utils/size'

import {
  FileInfoContainer,
  FileInfoType,
  FileLineContainer,
  FileLineLastPoint,
  FileLinePoint,
  FileStatusContainer,
  ProgressbarContainer,
  StatusMessage,
} from './AssetLine.style'

type AssetLineProps = {
  isLast?: boolean
  asset: AssetUpload
}

export const AssetLine: React.FC<AssetLineProps> = ({ isLast = false, asset }) => {
  const navigate = useNavigate()
  const startFileUpload = useStartFileUpload()
  const uploadStatus = useUploadsStore((state) => state.uploadsStatus[asset.contentId])

  const thumbnailDialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const avatarDialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropDialogImperativeHandle>(null)

  const [openDifferentFileDialog, closeDifferentFileDialog] = useDialog({
    title: 'Different file was selected!',
    description: `We detected that you selected a different file than the one you uploaded previously. Select the same file to continue the upload or edit ${
      asset.parentObject.type === 'channel' ? 'your channel' : 'the video'
    } to use the new file.`,
    variant: 'warning',
    primaryButton: {
      text: 'Reselect file',
      onClick: () => {
        reselectFile()
        closeDifferentFileDialog()
      },
    },
    secondaryButton: {
      text: `Edit ${asset.parentObject.type === 'channel' ? 'channel' : 'video'}`,
      onClick: () => {
        if (asset.parentObject.type === 'video') {
          navigate(absoluteRoutes.studio.editVideo())
        }
        if (asset.parentObject.type === 'channel') {
          navigate(absoluteRoutes.studio.editChannel())
        }
        closeDifferentFileDialog()
      },
    },
    exitButton: false,
  })
  const [openMissingCropDataDialog, closeMissingCropDataDialog] = useDialog({
    title: 'Missing asset details',
    description:
      "It seems you've published this asset from a different device or you've cleared your browser history. All image assets require crop data to reconstruct, otherwise they end up being different files. Please try re-uploading from the original device or overwrite this asset.",
    variant: 'warning',
    secondaryButton: {
      text: 'Close',
      onClick: () => {
        closeMissingCropDataDialog()
      },
    },
    exitButton: false,
  })

  const onDrop: DropzoneOptions['onDrop'] = useCallback(
    async (acceptedFiles) => {
      const [file] = acceptedFiles
      const fileHash = await computeFileHash(file)
      if (fileHash !== asset.ipfsContentId) {
        openDifferentFileDialog()
      } else {
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
          {
            isReUpload: true,
          }
        )
      }
    },
    [asset, openDifferentFileDialog, startFileUpload]
  )

  const isVideo = asset.type === 'video'
  const { getRootProps, getInputProps, open: openFileSelect } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    noClick: true,
    noKeyboard: true,
    accept: isVideo ? 'video/*' : 'image/*',
  })

  const fileTypeText = isVideo ? 'Video file' : `${asset.type.charAt(0).toUpperCase() + asset.type.slice(1)} image`

  const handleChangeHost = () => {
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
    if (asset.type === 'video') {
      openFileSelect()
      return
    }
    if (!asset.imageCropData) {
      openMissingCropDataDialog()
      return
    }
    assetsDialogs[asset.type].current?.open(undefined, asset.imageCropData)
  }

  const renderStatusMessage = () => {
    if (uploadStatus?.lastStatus === 'reconnecting') {
      return 'Reconnecting...'
    }
    if (uploadStatus?.lastStatus === 'error') {
      return (
        <Button size="small" variant="secondary" icon={<SvgGlyphUpload />} onClick={handleChangeHost}>
          Try again
        </Button>
      )
    }
    if (!uploadStatus?.lastStatus) {
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

  const renderStatusIndicator = () => {
    if (uploadStatus?.lastStatus === 'completed') {
      return <SvgAlertSuccess />
    }
    if (uploadStatus?.lastStatus === 'error' || !uploadStatus?.lastStatus) {
      return <SvgAlertError />
    }
    return (
      <ProgressbarContainer>
        <CircularProgressbar value={uploadStatus?.progress ?? 0} />
      </ProgressbarContainer>
    )
  }

  return (
    <>
      <FileLineContainer isLast={isLast}>
        {isLast ? <FileLineLastPoint /> : <FileLinePoint />}
        <FileStatusContainer>{renderStatusIndicator()}</FileStatusContainer>
        <FileInfoContainer>
          <FileInfoType>
            {isVideo ? <SvgGlyphFileVideo /> : <SvgGlyphFileImage />}
            <Text variant="body2">{fileTypeText}</Text>
          </FileInfoType>
          <Text variant="body2">{dimension}</Text>
          <Text>{size}</Text>
        </FileInfoContainer>
        <StatusMessage variant="subtitle2">{renderStatusMessage()}</StatusMessage>
      </FileLineContainer>
      <ImageCropDialog ref={thumbnailDialogRef} imageType="videoThumbnail" onConfirm={handleCropConfirm} />
      <ImageCropDialog ref={avatarDialogRef} imageType="avatar" onConfirm={handleCropConfirm} />
      <ImageCropDialog ref={coverDialogRef} imageType="cover" onConfirm={handleCropConfirm} />
    </>
  )
}
