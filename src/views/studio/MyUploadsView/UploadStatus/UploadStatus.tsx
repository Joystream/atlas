import React, { useCallback, useRef } from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { ImageCropDialog, ImageCropDialogImperativeHandle } from '@/components/ImageCropDialog'
import { absoluteRoutes } from '@/config/routes'
import { useDialog } from '@/providers/dialogs'
import { useUploadsStore } from '@/providers/uploadsManager'
import { AssetUpload } from '@/providers/uploadsManager/types'
import { useStartFileUpload } from '@/providers/uploadsManager/useStartFileUpload'
import { CircularProgress } from '@/shared/components/CircularProgress'
import { Loader } from '@/shared/components/Loader'
import { Text } from '@/shared/components/Text'
import { SvgAlertSuccess, SvgAlertWarning, SvgGlyphFileImage, SvgGlyphFileVideo, SvgGlyphUpload } from '@/shared/icons'
import { transitions } from '@/shared/theme'
import { computeFileHash } from '@/utils/hashing'
import { formatBytes } from '@/utils/size'

import {
  FailedStatusWrapper,
  FileInfo,
  FileInfoContainer,
  FileInfoDetails,
  FileInfoType,
  FileLineContainer,
  FileLineLastPoint,
  FileLinePoint,
  FileStatusContainer,
  ProgressbarContainer,
  RetryButton,
  StatusText,
} from './UploadStatus.style'

import { UploadStatusGroupSize } from '../UploadStatusGroup'

type UploadStatusProps = {
  isLast?: boolean
  asset: AssetUpload
  size?: UploadStatusGroupSize
}

export const UploadStatus: React.FC<UploadStatusProps> = ({ isLast = false, asset, size }) => {
  const navigate = useNavigate()
  const startFileUpload = useStartFileUpload()
  const uploadStatus = useUploadsStore((state) => state.uploadsStatus[asset.contentId])
  const { setUploadStatus } = useUploadsStore((state) => state.actions)

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
          navigate(absoluteRoutes.studio.videoWorkspace())
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
      setUploadStatus(asset.contentId, { lastStatus: 'inProgress', progress: 0 })
      const fileHash = await computeFileHash(file)
      if (fileHash !== asset.ipfsContentId) {
        setUploadStatus(asset.contentId, { lastStatus: undefined })
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
    [asset, openDifferentFileDialog, setUploadStatus, startFileUpload]
  )

  const isVideo = asset.type === 'video'
  const {
    getRootProps,
    getInputProps,
    open: openFileSelect,
  } = useDropzone({
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

  const assetDimension =
    asset.dimensions?.width && asset.dimensions.height
      ? `${Math.floor(asset.dimensions.width)}x${Math.floor(asset.dimensions.height)}`
      : ''
  const assetSize = formatBytes(asset.size)

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
    const failedStatusText = size === 'compact' ? 'Upload failed' : 'Asset upload failed'
    if (uploadStatus?.lastStatus === 'error') {
      return (
        <FailedStatusWrapper>
          <StatusText variant="subtitle2" secondary size={size}>
            {failedStatusText}
          </StatusText>
          <RetryButton size="small" variant="secondary" icon={<SvgGlyphUpload />} onClick={handleChangeHost}>
            Try again
          </RetryButton>
        </FailedStatusWrapper>
      )
    }
    if (!uploadStatus?.lastStatus) {
      return (
        <FailedStatusWrapper>
          <StatusText variant="subtitle2" secondary size={size}>
            {failedStatusText}
          </StatusText>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <RetryButton size="small" variant="secondary" icon={<SvgGlyphUpload />} onClick={reselectFile}>
              Reconnect file
            </RetryButton>
          </div>
        </FailedStatusWrapper>
      )
    }
  }

  const renderStatusIndicator = () => {
    if (uploadStatus?.lastStatus === 'completed') {
      return <SvgAlertSuccess />
    }
    if (uploadStatus?.lastStatus === 'error' || !uploadStatus?.lastStatus) {
      return <SvgAlertWarning />
    }
    if (uploadStatus?.lastStatus === 'processing') {
      return <Loader variant="small" />
    }
    return (
      <ProgressbarContainer>
        <CircularProgress strokeWidth={10} value={uploadStatus?.progress ?? 0} />
      </ProgressbarContainer>
    )
  }
  const isReconnecting = uploadStatus?.lastStatus === 'reconnecting'
  return (
    <>
      <FileLineContainer isLast={isLast} size={size}>
        <FileInfoContainer>
          {isLast ? <FileLineLastPoint size={size} /> : <FileLinePoint size={size} />}
          <FileStatusContainer>
            <SwitchTransition>
              <CSSTransition
                key={uploadStatus?.lastStatus || 'no-status'}
                classNames={transitions.names.fade}
                timeout={200}
              >
                {renderStatusIndicator()}
              </CSSTransition>
            </SwitchTransition>
          </FileStatusContainer>
          <FileInfo size={size}>
            <FileInfoType warning={isReconnecting && size === 'compact'}>
              {isVideo ? <SvgGlyphFileVideo /> : <SvgGlyphFileImage />}
              <Text variant="body2">{fileTypeText}</Text>
            </FileInfoType>
            {size === 'compact' && isReconnecting ? (
              <Text variant="body2" secondary>
                Trying to reconnect...({uploadStatus.retries})
              </Text>
            ) : (
              <FileInfoDetails size={size}>
                {assetDimension && (
                  <Text variant="body2" secondary>
                    {assetDimension}
                  </Text>
                )}
                {assetSize && <Text secondary>{assetSize}</Text>}
              </FileInfoDetails>
            )}
          </FileInfo>
        </FileInfoContainer>
        {renderStatusMessage()}
      </FileLineContainer>
      <ImageCropDialog ref={thumbnailDialogRef} imageType="videoThumbnail" onConfirm={handleCropConfirm} />
      <ImageCropDialog ref={avatarDialogRef} imageType="avatar" onConfirm={handleCropConfirm} />
      <ImageCropDialog ref={coverDialogRef} imageType="cover" onConfirm={handleCropConfirm} />
    </>
  )
}
