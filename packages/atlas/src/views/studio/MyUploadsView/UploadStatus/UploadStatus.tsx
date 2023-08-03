import { FC, useCallback, useMemo, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import {
  SvgActionClosedCaptions,
  SvgActionImageFile,
  SvgActionReupload,
  SvgActionVideoFile,
  SvgAlertsSuccess24,
  SvgAlertsWarning24,
} from '@/assets/icons'
import { CircularProgress } from '@/components/CircularProgress'
import { Text } from '@/components/Text'
import { Loader } from '@/components/_loaders/Loader'
import { ImageCropModal, ImageCropModalImperativeHandle } from '@/components/_overlays/ImageCropModal'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useChannelsStorageBucketsCount } from '@/providers/assets/assets.hooks'
import { useBloatFeesAndPerMbFees } from '@/providers/joystream'
import { useStartFileUpload } from '@/providers/uploads/uploads.hooks'
import { useUploadsStore } from '@/providers/uploads/uploads.store'
import { AssetUpload } from '@/providers/uploads/uploads.types'
import { useUser } from '@/providers/user/user.hooks'
import { transitions } from '@/styles'
import { AssetDimensions, ImageCropData } from '@/types/cropper'
import { createId } from '@/utils/createId'
import { computeFileHash } from '@/utils/hashing'
import { capitalizeFirstLetter } from '@/utils/misc'
import { formatBytes } from '@/utils/size'

import { FeeData, useUploadStatus, useUploadStatusModals } from './UploadStatus.hooks'
import {
  FailedStatusWrapper,
  FileDimension,
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
} from './UploadStatus.styles'

type UploadStatusProps = {
  isLast?: boolean
  asset: AssetUpload
  size?: 'compact' | 'large'
}

export const UploadStatus: FC<UploadStatusProps> = ({ isLast = false, asset, size }) => {
  const startFileUpload = useStartFileUpload()
  const uploadStatus = useUploadsStore((state) => state.uploadsStatus[asset.id])
  const { setUploadStatus } = useUploadsStore((state) => state.actions)

  const { channelId, memberId, accountId } = useUser()
  const { dataObjectStateBloatBondValue } = useBloatFeesAndPerMbFees()
  const channelBucketsCount = useChannelsStorageBucketsCount(channelId)
  const mdMatch = useMediaMatch('md')
  const { handleAvatarUpdate, handleVideoUpdate } = useUploadStatus(asset)
  const { openNftConfirmationModal, openDifferentImageModal, openDifferentVideoModal, openDifferentBrowserModal } =
    useUploadStatusModals()

  const thumbnailDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const avatarDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropModalImperativeHandle>(null)

  const assetsDialogs = useMemo(
    () => ({
      avatar: avatarDialogRef,
      cover: coverDialogRef,
      thumbnail: thumbnailDialogRef,
    }),
    []
  )

  const assetDialogsFee: FeeData | undefined = !asset.imageCropData
    ? asset.parentObject.type === 'channel'
      ? {
          methodName: 'updateChannelTx',
          args: [
            asset.parentObject.id,
            memberId ?? '',
            { ownerAccount: accountId ?? '' },
            {},
            [asset.id],
            dataObjectStateBloatBondValue.toString(),
            channelBucketsCount.toString(),
          ],
        }
      : {
          methodName: 'updateVideoTx',
          args: [
            asset.parentObject.id,
            memberId ?? '',
            { clearSubtitles: true },
            undefined,
            {},
            [asset.id],
            dataObjectStateBloatBondValue.toString(),
            channelBucketsCount.toString(),
          ],
        }
    : undefined

  const reselectFile = useCallback(
    async (openFileSelect: () => void) => {
      if (asset.type === 'video' || asset.type === 'subtitles') {
        openFileSelect()
        return
      }
      if (!asset.imageCropData) {
        openDifferentBrowserModal(assetsDialogs[asset.type].current?.open)
        return
      }
      assetsDialogs[asset.type].current?.open()
    },
    [openDifferentBrowserModal, asset, assetsDialogs]
  )

  const {
    getRootProps,
    getInputProps,
    open: openFileSelect,
  } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const [file] = acceptedFiles
      setUploadStatus(asset.id, { lastStatus: 'inProgress', progress: 0 })
      const fileHash = await computeFileHash(file)
      if (fileHash !== asset.ipfsHash) {
        if (asset.hasNft) {
          openNftConfirmationModal(file, () => reselectFile(openFileSelect))
          return
        }
        const newAssetId = `local-video-${createId()}`
        setUploadStatus(asset.id, { lastStatus: undefined })
        openDifferentVideoModal({
          fee: {
            methodName: 'updateVideoTx',
            args: [
              asset.parentObject.id,
              memberId ?? '',
              {},
              undefined,
              {
                [asset.type === 'video' ? 'media' : 'subtitles']: {
                  ...file,
                  id: newAssetId,
                  ipfsHash: fileHash,
                },
              },
              [asset.id],
              dataObjectStateBloatBondValue.toString(),
              channelBucketsCount.toString(),
            ],
          },
          name: file.name,
          cb: () => handleVideoUpdate(file, newAssetId),
        })
      } else {
        startFileUpload(file, asset, {
          isReUpload: true,
        })
      }
    },
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
      : `${capitalizeFirstLetter(asset.type)} image`

  const handleChangeHost = () => {
    startFileUpload(null, asset, {
      changeHost: true,
    })
  }

  const handleCropConfirm = async (
    croppedBlob: Blob,
    croppedUrl?: string,
    dimensions?: AssetDimensions,
    cropData?: ImageCropData,
    originalBlob?: File | Blob | null
  ) => {
    if (!originalBlob) {
      return
    }
    const fileHash = await computeFileHash(croppedBlob)
    if (fileHash !== asset.ipfsHash) {
      const blob = croppedBlob as File
      const newAsset = {
        ...blob,
        size: croppedBlob?.size,
        url: croppedUrl,
      } as File & { size?: string; url?: string }
      const isChannelUpload = asset.parentObject.type === 'channel'
      const handleUpdate = async () =>
        await handleAvatarUpdate(newAsset, croppedBlob, croppedUrl, dimensions, cropData, originalBlob)
      if (asset.imageCropData) {
        openDifferentImageModal({
          fee: isChannelUpload
            ? {
                methodName: 'updateChannelTx',
                args: [
                  asset.parentObject.id,
                  memberId ?? '',
                  { ownerAccount: accountId ?? '' },
                  asset.type === 'avatar'
                    ? { avatarPhoto: { ...newAsset, ipfsHash: fileHash } }
                    : { coverPhoto: { ...newAsset, ipfsHash: fileHash } },
                  [asset.id],
                  dataObjectStateBloatBondValue.toString(),
                  channelBucketsCount.toString(),
                ],
              }
            : {
                methodName: 'updateVideoTx',
                args: [
                  asset.parentObject.id,
                  memberId ?? '',
                  { clearSubtitles: true },
                  undefined,
                  { thumbnailPhoto: { ...newAsset, ipfsHash: fileHash } },
                  [asset.id],
                  dataObjectStateBloatBondValue.toString(),
                  channelBucketsCount.toString(),
                ],
              },
          cb: handleUpdate,
          name: (originalBlob as File).name,
        })
      } else {
        await handleUpdate()
      }
    } else {
      startFileUpload(croppedBlob, asset, {
        isReUpload: true,
      })
    }
  }

  const assetDimension =
    asset.dimensions?.width && asset.dimensions.height
      ? `${Math.floor(asset.dimensions.width)}x${Math.floor(asset.dimensions.height)}`
      : ''
  const assetSubtitlesLanguage = asset.type === 'subtitles' && asset.subtitlesLanguageIso
  const assetSize = formatBytes(Number(asset.size))

  const renderStatusMessage = () => {
    const failedStatusText = (
      <Text as="span" variant={mdMatch ? 't200' : 't100'} color="colorText">
        Asset upload failed
      </Text>
    )
    if (uploadStatus?.lastStatus === 'error') {
      return (
        <FailedStatusWrapper>
          {failedStatusText}
          <RetryButton size="small" icon={<SvgActionReupload />} onClick={handleChangeHost}>
            Try again
          </RetryButton>
        </FailedStatusWrapper>
      )
    }
    if (!uploadStatus?.lastStatus) {
      return (
        <FailedStatusWrapper>
          {failedStatusText}
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <RetryButton size="small" onClick={() => reselectFile(openFileSelect)}>
              Select file
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
          {isLast ? <FileLineLastPoint /> : <FileLinePoint />}
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
                {asset.name || fileTypeText}
              </Text>
            </FileInfoType>
            {size === 'compact' && isReconnecting ? (
              <Text as="span" variant="t200" color="colorText">
                Trying to reconnect...({uploadStatus.retries})
              </Text>
            ) : (
              <FileInfoDetails size={size}>
                {assetDimension && (
                  <FileDimension as="span" variant="t200" color="colorText">
                    {assetDimension}
                  </FileDimension>
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
          {mdMatch && renderStatusMessage()}
        </FileInfoContainer>
        {!mdMatch && renderStatusMessage()}
      </FileLineContainer>
      <ImageCropModal
        fee={assetDialogsFee}
        ref={thumbnailDialogRef}
        imageType="videoThumbnail"
        onConfirm={handleCropConfirm}
      />
      <ImageCropModal fee={assetDialogsFee} ref={avatarDialogRef} imageType="avatar" onConfirm={handleCropConfirm} />
      <ImageCropModal fee={assetDialogsFee} ref={coverDialogRef} imageType="cover" onConfirm={handleCropConfirm} />
    </>
  )
}
