import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import shallow from 'zustand/shallow'

import {
  GetExtendedFullChannelsQuery,
  GetExtendedFullChannelsQueryHookResult,
} from '@/api/queries/__generated__/channels.generated'
import { SelectItem } from '@/components/_inputs/Select'
import { ImageCropModalImperativeHandle, ImageCropModalProps } from '@/components/_overlays/ImageCropModal'
import { atlasConfig } from '@/config'
import { ChannelInputAssets, ChannelInputMetadata } from '@/joystream-lib/types'
import { useChannelsStorageBucketsCount } from '@/providers/assets/assets.hooks'
import { useConnectionStatusStore } from '@/providers/connectionStatus'
import { useBloatFeesAndPerMbFees, useFee, useJoystream } from '@/providers/joystream'
import { useUploadsStore } from '@/providers/uploads/uploads.store'
import { useUser } from '@/providers/user/user.hooks'
import { useVideoWorkspace } from '@/providers/videoWorkspace'
import { createId } from '@/utils/createId'
import { SentryLogger } from '@/utils/logs'
import {
  CreateEditChannelFormInputs,
  useCreateEditChannelSubmit,
} from '@/views/studio/CreateEditChannelView/CreateEditChannelView.hooks'

export const PUBLIC_SELECT_ITEMS: SelectItem<boolean>[] = [
  { name: 'Public', value: true },
  { name: 'Unlisted (channel will not appear in feeds and search)', value: false },
]

type NewChannelProps = {
  type: 'new'
}

type EditChannelProps = {
  type: 'edit'
  channel?: GetExtendedFullChannelsQuery['extendedChannels'][number]['channel']
  refetchChannel: GetExtendedFullChannelsQueryHookResult['refetch']
}

type FormType = EditChannelProps | NewChannelProps

const isEditType = (props: FormType): props is EditChannelProps => props.type === 'edit'
const DEFAULT_LANGUAGE = atlasConfig.derived.popularLanguagesSelectValues[0].value

export const useChannelForm = (props: FormType) => {
  const [showConnectToYtDialog, setShowConnectToYtDialog] = useState(false)
  const firstRender = useRef(true)
  const avatarDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const { memberId, accountId, channelId } = useUser()
  const cachedChannelId = useRef(channelId)
  const { joystream } = useJoystream()
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const handleChannelSubmit = useCreateEditChannelSubmit()
  const channel = isEditType(props) ? props.channel : undefined
  const newChannel = !isEditType(props)
  const channelBucketsCount = useChannelsStorageBucketsCount(channel?.id ?? null)

  const form = useForm<CreateEditChannelFormInputs>({
    mode: 'onSubmit',
    defaultValues: {
      avatar: { contentId: null, assetDimensions: null, imageCropData: null, originalBlob: undefined },
      cover: { contentId: null, assetDimensions: null, imageCropData: null, originalBlob: undefined },
      title: '',
      description: '',
      language: DEFAULT_LANGUAGE,
      isPublic: true,
    },
  })
  const {
    handleSubmit: createSubmitHandler,
    formState: { isDirty, dirtyFields },
    watch,
    setValue,
    reset,
    getValues,
  } = form
  const avatarContentId = watch('avatar').contentId
  const coverContentId = watch('cover').contentId

  const isAvatarUploading = useUploadsStore(
    (state) =>
      avatarContentId
        ? state.uploadsStatus[avatarContentId]?.lastStatus === 'processing' ||
          state.uploadsStatus[avatarContentId]?.lastStatus === 'inProgress' ||
          state.uploadsStatus[avatarContentId]?.lastStatus === 'reconnecting'
        : null,
    shallow
  )
  const isCoverUploading = useUploadsStore(
    (state) =>
      coverContentId
        ? state.uploadsStatus[coverContentId]?.lastStatus === 'processing' ||
          state.uploadsStatus[coverContentId]?.lastStatus === 'inProgress' ||
          state.uploadsStatus[coverContentId]?.lastStatus === 'reconnecting'
        : null,
    shallow
  )

  const { isWorkspaceOpen, setIsWorkspaceOpen } = useVideoWorkspace()

  useEffect(() => {
    if (newChannel) {
      reset({
        avatar: { contentId: null },
        cover: { contentId: null },
        title: '',
        description: '',
        language: DEFAULT_LANGUAGE,
        isPublic: true,
      })
    }
  }, [newChannel, reset])

  const createChannelMetadata = useCallback(
    (data: CreateEditChannelFormInputs) => {
      return isDirty
        ? {
            ...(dirtyFields.title ? { title: data.title?.trim() ?? '' } : {}),
            ...(dirtyFields.description ? { description: data.description?.trim() ?? '' } : {}),
            ...(dirtyFields.language || newChannel ? { language: data.language } : {}),
            ...(dirtyFields.isPublic || newChannel ? { isPublic: data.isPublic } : {}),
            ownerAccount: accountId || '',
          }
        : null
    },
    [accountId, dirtyFields, isDirty, newChannel]
  )

  const createChannelAssets = useCallback((): [ChannelInputAssets, string[]] => {
    const replacedAssetsIds: string[] = []
    const newAssets: ChannelInputAssets = {}
    const avatarAsset = getValues('avatar')
    const coverAsset = getValues('cover')
    if (avatarAsset?.croppedBlob?.size) {
      newAssets.avatarPhoto = {
        size: avatarAsset?.croppedBlob.size,
        ipfsHash: '',
      }
    }
    if (channel?.avatarPhoto?.id && channel?.avatarPhoto?.id !== avatarAsset.contentId) {
      replacedAssetsIds.push(channel.avatarPhoto.id)
    }
    if (coverAsset?.croppedBlob?.size) {
      newAssets.coverPhoto = {
        size: coverAsset.croppedBlob.size,
        ipfsHash: '',
      }
    }
    if (channel?.coverPhoto?.id && channel?.coverPhoto?.id !== coverAsset.contentId) {
      replacedAssetsIds.push(channel.coverPhoto.id)
    }
    return [newAssets, replacedAssetsIds]
  }, [channel?.avatarPhoto?.id, channel?.coverPhoto?.id, getValues])

  const channelMetadata = createChannelMetadata(watch())
  const [newChannelAssets, removedChannelAssetsIds] = createChannelAssets()

  const { channelStateBloatBondValue, dataObjectStateBloatBondValue } = useBloatFeesAndPerMbFees()

  const { fullFee: updateChannelFee, loading: updateChannelFeeLoading } = useFee(
    'updateChannelTx',
    channelId && memberId && channelMetadata && isDirty && !newChannel
      ? [
          channelId,
          memberId,
          channelMetadata,
          newChannelAssets,
          removedChannelAssetsIds,
          dataObjectStateBloatBondValue.toString(),
          channelBucketsCount.toString(),
        ]
      : undefined,
    newChannelAssets
  )
  const { fullFee: createChannelFee, loading: createChannelFeeLoading } = useFee(
    'createChannelTx',
    memberId && channelMetadata && newChannel
      ? [
          memberId,
          channelMetadata,
          newChannelAssets,
          // use basic buckets config for fee estimation
          { storage: [0], distribution: [{ distributionBucketFamilyId: 0, distributionBucketIndex: 0 }] },
          dataObjectStateBloatBondValue.toString(),
          channelStateBloatBondValue.toString(),
        ]
      : undefined,
    newChannelAssets
  )

  // set default values for editing channel
  useEffect(() => {
    if (newChannel || !channel) {
      return
    }

    const { title, description, isPublic, language, avatarPhoto, coverPhoto } = channel

    const foundLanguage = atlasConfig.derived.languagesSelectValues.find(({ value }) => value === language)
    const isChannelChanged = cachedChannelId.current !== channel.id

    // This condition should prevent from updating cover/avatar when the upload is done
    if (isChannelChanged || firstRender.current) {
      reset({
        avatar: {
          contentId: avatarPhoto?.id,
          assetDimensions: null,
          imageCropData: null,
          originalBlob: undefined,
          originalUrl: channel.avatarPhoto?.resolvedUrl,
        },
        cover: {
          contentId: coverPhoto?.id,
          assetDimensions: null,
          imageCropData: null,
          originalBlob: undefined,
          originalUrl: channel.coverPhoto?.resolvedUrl,
        },
        title: title || '',
        description: description || '',
        isPublic: isPublic ?? false,
        language: foundLanguage?.value || DEFAULT_LANGUAGE,
      })
      firstRender.current = false
      cachedChannelId.current = channel.id
    }
  }, [channel, newChannel, reset])

  const handleSubmit = createSubmitHandler(async (data) => {
    if (!joystream || !memberId || !accountId) {
      return
    }

    if (!channelBucketsCount && !newChannel) {
      SentryLogger.error('Channel buckets count is not set', 'CreateEditChannelView')
      return
    }

    setIsWorkspaceOpen(false)
    const metadata: ChannelInputMetadata = {
      ...(dirtyFields.title ? { title: data.title?.trim() ?? '' } : {}),
      ...(dirtyFields.description ? { description: data.description?.trim() ?? '' } : {}),
      ...(dirtyFields.language || newChannel ? { language: data.language } : {}),
      ...(dirtyFields.isPublic || newChannel ? { isPublic: data.isPublic } : {}),
      ownerAccount: accountId ?? '',
    }

    await handleChannelSubmit(
      {
        metadata,
        channel,
        newChannel,
        assets: {
          avatarPhoto: data.avatar,
          coverPhoto: data.cover,
        },
        refetchChannel: isEditType(props) ? props.refetchChannel : undefined,
        fee: newChannel ? createChannelFee : updateChannelFee,
      },
      () => reset(getValues()),
      setValue,
      () =>
        atlasConfig.features.ypp.googleConsoleClientId &&
        atlasConfig.features.ypp.youtubeSyncApiUrl &&
        setTimeout(() => setShowConnectToYtDialog(true), 2000)
    )
  })

  const handleCoverChange: ImageCropModalProps['onConfirm'] = (
    croppedBlob,
    croppedUrl,
    assetDimensions,
    imageCropData,
    originalBlob
  ) => {
    const newCoverAssetId = `local-cover-${createId()}`
    setValue(
      'cover',
      {
        contentId: newCoverAssetId,
        assetDimensions,
        croppedBlob,
        imageCropData,
        originalBlob,
        croppedUrl,
      },
      { shouldDirty: true }
    )
  }

  const handleAvatarChange: ImageCropModalProps['onConfirm'] = (
    croppedBlob,
    croppedUrl,
    assetDimensions,
    imageCropData,
    originalBlob
  ) => {
    const newAvatarAssetId = `local-avatar-${createId()}`
    setValue(
      'avatar',
      { contentId: newAvatarAssetId, assetDimensions, imageCropData, originalBlob, croppedUrl, croppedBlob },
      { shouldDirty: true }
    )
  }

  const handleDeleteAvatar = () => {
    setValue(
      'avatar',
      { contentId: null, assetDimensions: null, imageCropData: null, originalBlob: undefined },
      { shouldDirty: true }
    )
  }

  const handleDeleteCover = () => {
    setValue(
      'cover',
      {
        contentId: null,
        assetDimensions: null,
        imageCropData: null,
        originalBlob: undefined,
        croppedUrl: undefined,
        originalUrl: undefined,
      },
      { shouldDirty: true }
    )
  }

  const hasAvatarUploadFailed = isAvatarUploading
    ? false
    : (channel?.avatarPhoto && !channel.avatarPhoto.isAccepted && !dirtyFields.avatar) || false
  const hasCoverUploadFailed = isCoverUploading
    ? false
    : (channel?.coverPhoto && !channel.coverPhoto.isAccepted && !dirtyFields.cover) || false
  const hideActionBar = !isDirty || nodeConnectionStatus !== 'connected'

  return {
    form,
    fee: isEditType(props) ? updateChannelFee : createChannelFee,
    feeLoading: isEditType(props) ? updateChannelFeeLoading : createChannelFeeLoading,
    hasAvatarUploadFailed,
    hasCoverUploadFailed,
    hideActionBar,
    isWorkspaceOpen,
    showConnectToYtDialog,
    actions: {
      handleDeleteCover,
      handleDeleteAvatar,
      handleAvatarChange,
      handleCoverChange,
      handleSubmit,
    },
    refs: {
      avatarDialogRef,
      coverDialogRef,
    },
  }
}
