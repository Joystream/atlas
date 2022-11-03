import { FC, useCallback, useMemo, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useFullChannel } from '@/api/hooks/channel'
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
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useBloatFeesAndPerMbFees } from '@/providers/joystream/joystream.hooks'
import { useStartFileUpload } from '@/providers/uploads/uploads.hooks'
import { useUploadsStore } from '@/providers/uploads/uploads.store'
import { AssetUpload } from '@/providers/uploads/uploads.types'
import { useUser } from '@/providers/user/user.hooks'
import { useVideoWorkspace } from '@/providers/videoWorkspace'
import { transitions } from '@/styles'
import { AssetDimensions, ImageCropData } from '@/types/cropper'
import { createId } from '@/utils/createId'
import { computeFileHash } from '@/utils/hashing'
import { SentryLogger } from '@/utils/logs'
import { capitalizeFirstLetter, shortenString } from '@/utils/misc'
import { formatBytes } from '@/utils/size'
import { useCreateEditChannelSubmit } from '@/views/studio/CreateEditChannelView/CreateEditChannelView.hooks'
import { useHandleVideoWorkspaceSubmit } from '@/views/studio/VideoWorkspace/VideoWorkspace.hooks'

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

const FILE_NAME_LENGTH_LIMIT = 24

export const UploadStatus: FC<UploadStatusProps> = ({ isLast = false, asset, size }) => {
  const startFileUpload = useStartFileUpload()
  const uploadStatus = useUploadsStore((state) => state.uploadsStatus[asset.id])
  const { setUploadStatus, removeAssetFromUploads } = useUploadsStore((state) => state.actions)

  const { channelId, memberId, accountId } = useUser()
  const { dataObjectStateBloatBondValue } = useBloatFeesAndPerMbFees()
  const channelBucketsCount = useChannelsStorageBucketsCount(channelId)
  const mdMatch = useMediaMatch('md')
  const handleVideoWorkspaceSubmit = useHandleVideoWorkspaceSubmit()
  const handleEditChannelSubmit = useCreateEditChannelSubmit()
  const { setEditedVideo } = useVideoWorkspace()

  const thumbnailDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const avatarDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropModalImperativeHandle>(null)

  const [openConfirmationModal, closeConfirmationModal] = useConfirmationModal()

  const { channel } = useFullChannel(
    channelId || '',
    {
      skip: !channelId,
      onError: (error) =>
        SentryLogger.error('Failed to fetch channel', 'UploadStatus', error, {
          channel: { id: channelId },
        }),
    },
    { where: { isPublic_eq: undefined, isCensored_eq: undefined } }
  )

  const assetsDialogs = useMemo(
    () => ({
      avatar: avatarDialogRef,
      cover: coverDialogRef,
      thumbnail: thumbnailDialogRef,
    }),
    []
  )

  const reselectFile = useCallback(
    (openFileSelect: () => void) => {
      setEditedVideo({
        id: asset.parentObject.id,
        isDraft: false,
        isNew: false,
      })
      if (asset.type === 'video' || asset.type === 'subtitles') {
        openFileSelect()
        return
      }
      if (!asset.imageCropData) {
        const isChannelUpload = asset.parentObject.type === 'channel'
        openConfirmationModal({
          title: 'You need to sign a blockchain transaction to continue',
          description:
            "It seems you've initially selected this image from a different device, or that you've cleared your browser's history. Because of this, selecting a new image will require signing a blockchain transaction, as a confirmation of your edit. Are you sure you want to continue?",
          primaryButton: {
            text: 'Continue',
            onClick: () => {
              if (asset.type === 'video' || asset.type === 'subtitles') {
                return
              }
              closeConfirmationModal()
              assetsDialogs[asset.type].current?.open()
              assetsDialogs[asset.type].current?.setFee(
                isChannelUpload
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
              )
            },
          },
          secondaryButton: {
            text: 'Cancel',
            onClick: () => closeConfirmationModal(),
          },
        })
        return
      }
      assetsDialogs[asset.type].current?.open()
    },
    [
      accountId,
      asset.id,
      asset.imageCropData,
      asset.parentObject.id,
      asset.parentObject.type,
      asset.type,
      assetsDialogs,
      channelBucketsCount,
      closeConfirmationModal,
      dataObjectStateBloatBondValue,
      memberId,
      openConfirmationModal,
      setEditedVideo,
    ]
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
          openConfirmationModal({
            title: 'Select the exact same file',
            description: `This file (${
              file.name.length > FILE_NAME_LENGTH_LIMIT ? shortenString(file.name, 16, 8) : file.name
            }) is different from the one you selected before. Since you minted an NFT for this video, in order to continue, you must select the exact same file.`,
            primaryButton: {
              text: 'Select file',
              onClick: () => {
                reselectFile(openFileSelect)
                closeConfirmationModal()
              },
            },
            secondaryButton: {
              text: 'Cancel',
              onClick: () => closeConfirmationModal(),
            },
          })
          return
        }
        const newAssetId = `local-video-${createId()}`
        setEditedVideo({
          id: asset.parentObject.id,
          isDraft: false,
          isNew: false,
        })
        setUploadStatus(asset.id, { lastStatus: undefined })
        openConfirmationModal({
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
              [],
              dataObjectStateBloatBondValue.toString(),
              channelBucketsCount.toString(),
            ],
          },
          title: 'Upload different file?',
          description: `This file (${
            file.name.length > FILE_NAME_LENGTH_LIMIT ? shortenString(file.name, 16, 8) : file.name
          }) is different from the one you selected before. To upload it, you’ll need to sign a blockchain transaction to confirm editing your video. Are you sure you want to continue?`,
          type: 'warning',
          primaryButton: {
            text: 'Upload file',
            onClick: async () => {
              closeConfirmationModal()
              await handleVideoWorkspaceSubmit({
                assets: {
                  media: {
                    ...file,
                    hashPromise: computeFileHash(file),
                    id: newAssetId,
                    blob: file,
                    size: file.size,
                  },
                },
                metadata: { clearSubtitles: true },
                nftMetadata: undefined,
              })
              removeAssetFromUploads(asset.id)
            },
          },
          secondaryButton: {
            text: 'Cancel',
            onClick: () => closeConfirmationModal(),
          },
        })
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
            name: asset.name,
          },
          {
            isReUpload: true,
          }
        )
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
        name: asset.name,
      },
      {
        changeHost: true,
      }
    )
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
      const isChannelUpload = asset.parentObject.type === 'channel'
      const newAssset = {
        ...blob,
        size: croppedBlob?.size,
        url: croppedUrl,
      }
      const handleUpdate = async () => {
        if (isChannelUpload) {
          const assetDimensions = dimensions !== undefined ? dimensions : null
          const imageCropData = cropData !== undefined ? cropData : null
          await handleEditChannelSubmit({
            metadata: { ownerAccount: accountId ?? '' },
            channel,
            newChannel: false,
            assets:
              asset.type === 'avatar'
                ? {
                    avatarPhoto: {
                      ...newAssset,
                      contentId: `local-avatar-${createId()}`,
                      originalBlob,
                      imageCropData,
                      assetDimensions,
                    },
                    coverPhoto: {
                      assetDimensions: null,
                      contentId: null,
                      imageCropData: null,
                      originalBlob: undefined,
                    },
                  }
                : {
                    coverPhoto: {
                      ...newAssset,
                      contentId: `local-cover-${createId()}`,
                      originalBlob,
                      imageCropData,
                      assetDimensions,
                    },
                    avatarPhoto: {
                      assetDimensions: null,
                      contentId: null,
                      imageCropData: null,
                      originalBlob: undefined,
                    },
                  },
            avatarAsset:
              asset.type === 'avatar'
                ? {
                    blob: croppedBlob,
                    url: croppedUrl,
                  }
                : null,
            coverAsset:
              asset.type === 'cover'
                ? {
                    blob: croppedBlob,
                    url: croppedUrl,
                  }
                : null,
          })
        } else {
          const newCropAssetId = `local-thumbnail-crop-${createId()}`
          const newOriginalAssetId = `local-thumbnail-original-${createId()}`
          await handleVideoWorkspaceSubmit({
            assets: {
              thumbnailPhoto: {
                ...newAssset,
                blob,
                id: newCropAssetId,
                originalId: newOriginalAssetId,
                hashPromise: computeFileHash(croppedBlob),
                cropData,
                dimensions,
              },
            },
            metadata: { clearSubtitles: true },
            nftMetadata: undefined,
          })
        }
        removeAssetFromUploads(asset.id)
      }
      if (asset.imageCropData) {
        openConfirmationModal({
          fee: isChannelUpload
            ? {
                methodName: 'updateChannelTx',
                args: [
                  asset.parentObject.id,
                  memberId ?? '',
                  { ownerAccount: accountId ?? '' },
                  asset.type === 'avatar'
                    ? { avatarPhoto: { ...newAssset, ipfsHash: fileHash } }
                    : { coverPhoto: { ...newAssset, ipfsHash: fileHash } },
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
                  { thumbnailPhoto: { ...newAssset, ipfsHash: fileHash } },
                  [asset.id],
                  dataObjectStateBloatBondValue.toString(),
                  channelBucketsCount.toString(),
                ],
              },
          title: 'Continue with a different file?',
          description: `This file (${
            (originalBlob as File).name.length > FILE_NAME_LENGTH_LIMIT
              ? shortenString(blob.name, 16, 8)
              : (originalBlob as File).name
          }) is different from the one you selected before. To upload it, you’ll need to sign a blockchain transaction to confirm editing your video. Are you sure you want to continue?`,
          type: 'warning',
          primaryButton: {
            text: 'Continue',
            onClick: async () => {
              closeConfirmationModal()
              await handleUpdate()
            },
          },
          secondaryButton: {
            text: 'Cancel',
            onClick: () => closeConfirmationModal(),
          },
        })
      } else {
        await handleUpdate()
      }
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
          name: asset.name,
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
      <ImageCropModal ref={thumbnailDialogRef} imageType="videoThumbnail" onConfirm={handleCropConfirm} />
      <ImageCropModal ref={avatarDialogRef} imageType="avatar" onConfirm={handleCropConfirm} />
      <ImageCropModal ref={coverDialogRef} imageType="cover" onConfirm={handleCropConfirm} />
    </>
  )
}
