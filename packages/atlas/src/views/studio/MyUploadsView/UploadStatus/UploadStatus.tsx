import { FC, useCallback, useRef } from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import {
  SvgActionClosedCaptions,
  SvgActionImageFile,
  SvgActionUpload,
  SvgActionVideoFile,
  SvgAlertsSuccess24,
  SvgAlertsWarning24,
} from '@/assets/icons'
import { CircularProgress } from '@/components/CircularProgress'
import { Text } from '@/components/Text'
import { Loader } from '@/components/_loaders/Loader'
import { ImageCropModal, ImageCropModalImperativeHandle } from '@/components/_overlays/ImageCropModal'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useStartFileUpload } from '@/providers/uploads/uploads.hooks'
import { useUploadsStore } from '@/providers/uploads/uploads.store'
import { AssetUpload } from '@/providers/uploads/uploads.types'
import { transitions } from '@/styles'
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
  UploadStatusGroupSize,
} from './UploadStatus.styles'

type UploadStatusProps = {
  isLast?: boolean
  asset: AssetUpload
  size?: UploadStatusGroupSize
}

export const UploadStatus: FC<UploadStatusProps> = ({ isLast = false, asset, size }) => {
  const navigate = useNavigate()
  const startFileUpload = useStartFileUpload()
  const uploadStatus = useUploadsStore((state) => state.uploadsStatus[asset.id])
  const { setUploadStatus } = useUploadsStore((state) => state.actions)

  const thumbnailDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const avatarDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropModalImperativeHandle>(null)

  const [openDifferentFileDialog, closeDifferentFileDialog] = useConfirmationModal({
    title: 'Different file was selected!',
    description: `We detected that you selected a different file than the one you uploaded previously. Select the same file to continue the upload or edit ${
      asset.parentObject.type === 'channel' ? 'your channel' : 'the video'
    } to use the new file.`,
    type: 'warning',
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
  })
  const [openMissingCropDataDialog, closeMissingCropDataDialog] = useConfirmationModal({
    title: 'Missing asset details',
    description:
      "It seems you've published this asset from a different device or you've cleared your browser history. All image assets require crop data to reconstruct, otherwise they end up being different files. Please try re-uploading from the original device or overwrite this asset.",
    type: 'warning',
    secondaryButton: {
      text: 'Close',
      onClick: () => {
        closeMissingCropDataDialog()
      },
    },
  })

  const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>(
    async (acceptedFiles) => {
      const [file] = acceptedFiles
      setUploadStatus(asset.id, { lastStatus: 'inProgress', progress: 0 })
      const fileHash = await computeFileHash(file)
      if (fileHash !== asset.ipfsHash) {
        setUploadStatus(asset.id, { lastStatus: undefined })
        openDifferentFileDialog()
      } else {
        startFileUpload(
          file,
          {
            id: asset.id,
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
    accept: {
      [asset.type === 'video' ? 'video/*' : asset.type === 'subtitles' ? 'text/vtt' : 'image/*']: [],
    },
  })

  const fileTypeText =
    asset.type === 'video'
      ? 'Video file'
      : asset.type === 'subtitles'
      ? 'Subtitles'
      : `${asset.type.charAt(0).toUpperCase() + asset.type.slice(1)} image`

  const handleChangeHost = () => {
    startFileUpload(
      null,
      {
        id: asset.id,
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
    if (fileHash !== asset.ipfsHash) {
      openDifferentFileDialog()
    } else {
      startFileUpload(
        croppedBlob,
        {
          id: asset.id,
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
  const assetSubtitlesLanguage = asset.type === 'subtitles' && asset.subtitlesLanguageIso
  const assetSize = formatBytes(Number(asset.size))

  const assetsDialogs = {
    avatar: avatarDialogRef,
    cover: coverDialogRef,
    thumbnail: thumbnailDialogRef,
  }
  const reselectFile = () => {
    if (asset.type === 'video' || asset.type === 'subtitles') {
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
          <StatusText as="span" variant="t200" color="colorText" size={size}>
            {failedStatusText}
          </StatusText>
          <RetryButton size="small" variant="secondary" icon={<SvgActionUpload />} onClick={handleChangeHost}>
            Try again
          </RetryButton>
        </FailedStatusWrapper>
      )
    }
    if (!uploadStatus?.lastStatus) {
      return (
        <FailedStatusWrapper>
          <StatusText as="span" variant="t200" color="colorText" size={size}>
            {failedStatusText}
          </StatusText>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <RetryButton size="small" variant="secondary" icon={<SvgActionUpload />} onClick={reselectFile}>
              Reconnect file
            </RetryButton>
          </div>
        </FailedStatusWrapper>
      )
    }
  }

  const renderStatusIndicator = () => {
    if (uploadStatus?.lastStatus === 'completed') {
      return <SvgAlertsSuccess24 />
    }
    if (uploadStatus?.lastStatus === 'error' || !uploadStatus?.lastStatus) {
      return <SvgAlertsWarning24 />
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
              {asset.type === 'video' ? (
                <SvgActionVideoFile />
              ) : asset.type === 'subtitles' ? (
                <SvgActionClosedCaptions />
              ) : (
                <SvgActionImageFile />
              )}
              <Text as="span" variant="t200">
                {fileTypeText}
              </Text>
            </FileInfoType>
            {size === 'compact' && isReconnecting ? (
              <Text as="span" variant="t200" color="colorText">
                Trying to reconnect...({uploadStatus.retries})
              </Text>
            ) : (
              <FileInfoDetails size={size}>
                {assetDimension && (
                  <Text as="span" variant="t200" color="colorText">
                    {assetDimension}
                  </Text>
                )}
                {assetSubtitlesLanguage && (
                  <Text as="span" variant="t200" color="colorText">
                    {atlasConfig.derived.languagesLookup[assetSubtitlesLanguage]}
                  </Text>
                )}
                {assetSize && (
                  <Text as="span" variant="t200" color="colorText">
                    {assetSize}
                  </Text>
                )}
              </FileInfoDetails>
            )}
          </FileInfo>
        </FileInfoContainer>
        {renderStatusMessage()}
      </FileLineContainer>
      <ImageCropModal ref={thumbnailDialogRef} imageType="videoThumbnail" onConfirm={handleCropConfirm} />
      <ImageCropModal ref={avatarDialogRef} imageType="avatar" onConfirm={handleCropConfirm} />
      <ImageCropModal ref={coverDialogRef} imageType="cover" onConfirm={handleCropConfirm} />
    </>
  )
}
