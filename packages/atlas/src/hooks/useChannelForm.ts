import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import shallow from 'zustand/shallow'

import {
  GetExtendedFullChannelsQuery,
  GetExtendedFullChannelsQueryHookResult,
} from '@/api/queries/__generated__/channels.generated'
import { SelectItem } from '@/components/_inputs/Select'
import { ImageCropModalImperativeHandle, ImageCropModalProps } from '@/components/_overlays/ImageCropModal'
import { atlasConfig } from '@/config'
import { CreateEditChannelFormInputs, useCreateEditChannelSubmit } from '@/hooks/useChannelFormSubmit'
import { ChannelInputAssets, ChannelInputMetadata } from '@/joystream-lib/types'
import { useChannelsStorageBucketsCount } from '@/providers/assets/assets.hooks'
import { useConnectionStatusStore } from '@/providers/connectionStatus'
import { useBloatFeesAndPerMbFees, useFee, useJoystream } from '@/providers/joystream'
import { useUploadsStore } from '@/providers/uploads/uploads.store'
import { useUser } from '@/providers/user/user.hooks'
import { createId } from '@/utils/createId'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

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

const channelSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required.')
    .min(3, 'Title should be at least 3 characters long.')
    .max(40, 'Title can be only 40 characters long.'),
  isPublic: z.boolean(),
  description: z.string().optional(),
  language: z.any(),
  avatar: z.any(),
  cover: z.any(),
})

export const useChannelForm = (props: FormType) => {
  const [showConnectToYtDialog, setShowConnectToYtDialog] = useState(false)
  const firstRender = useRef(true)
  const avatarDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const { memberId, accountId, channelId, refetchUserMemberships } = useUser()
  const cachedChannelId = useRef(channelId)
  const { joystream } = useJoystream()
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const handleChannelSubmit = useCreateEditChannelSubmit()
  const channel = isEditType(props) ? props.channel : undefined
  const newChannel = !isEditType(props)
  const channelBucketsCount = useChannelsStorageBucketsCount(channel?.id ?? null)

  const form = useForm<CreateEditChannelFormInputs>({
    mode: 'onSubmit',
    resolver: zodResolver(channelSchema),
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
        ? ['processing', 'inProgress', 'reconnecting'].includes(state.uploadsStatus[avatarContentId]?.lastStatus ?? '')
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

  useEffect(() => {
    const init = async () => {
      if (newChannel || !channel) {
        return
      }

      const { title, description, isPublic, language, avatarPhoto, coverPhoto } = channel

      const foundLanguage = atlasConfig.derived.languagesSelectValues.find(({ value }) => value === language)
      let avatarBlob
      let coverBlob
      const originalBlobPromises = []
      const isChannelChanged = cachedChannelId.current !== channel.id
      if (avatarPhoto?.isAccepted && avatarPhoto.resolvedUrls[0]) {
        originalBlobPromises.push(
          fetch(avatarPhoto.resolvedUrls[0])
            .then((r) => r.blob())
            .then((createdBlob) => (avatarBlob = createdBlob))
            .catch((err) => ConsoleLogger.warn(`Cannot fetch avatar`, err))
        )
      }
      if (coverPhoto?.isAccepted && coverPhoto.resolvedUrls[0]) {
        originalBlobPromises.push(
          fetch(coverPhoto.resolvedUrls[0])
            .then((r) => r.blob())
            .then((createdBlob) => (coverBlob = createdBlob))
            .catch((err) => ConsoleLogger.warn(`Cannot fetch cover`, err))
        )
      }

      await Promise.all(originalBlobPromises)
      // This condition should prevent from updating cover/avatar when the upload is done
      if (isChannelChanged || firstRender.current) {
        reset({
          avatar: {
            contentId: avatarPhoto?.id,
            assetDimensions: null,
            imageCropData: null,
            originalBlob: avatarBlob,
            originalUrl: channel.avatarPhoto?.resolvedUrls[0],
          },
          cover: {
            contentId: coverPhoto?.id,
            assetDimensions: null,
            imageCropData: null,
            originalBlob: coverBlob,
            originalUrl: channel.coverPhoto?.resolvedUrls[0],
          },
          title: title || '',
          description: description || '',
          isPublic: isPublic ?? false,
          language: foundLanguage?.value || DEFAULT_LANGUAGE,
        })
        firstRender.current = false
        cachedChannelId.current = channel.id
      }
    }

    init()
  }, [channel, newChannel, reset])

  const handleSubmit = (onCompleted?: (channelId: string) => void) =>
    createSubmitHandler(async (data) => {
      if (!joystream || !memberId || !accountId) {
        return
      }

      if (!channelBucketsCount && !newChannel) {
        SentryLogger.error('Channel buckets count is not set', 'CreateEditChannelView')
        return
      }

      const metadata: ChannelInputMetadata = {
        ...(dirtyFields.title ? { title: data.title?.trim() ?? '' } : {}),
        ...(dirtyFields.description ? { description: data.description?.trim() ?? '' } : {}),
        ...(dirtyFields.language || newChannel ? { language: data.language } : {}),
        ...(dirtyFields.isPublic || newChannel ? { isPublic: data.isPublic } : {}),
        ownerAccount: accountId ?? '',
      }
      let channelId = ''
      await handleChannelSubmit({
        data: {
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
        onTxSync: (result) => {
          const values = getValues()
          reset({
            ...values,
            avatar: {
              ...values.avatar,
              contentId: result.assetsIds.avatarPhoto ?? values.avatar.contentId,
            },
            cover: {
              ...values.cover,
              contentId: result.assetsIds.coverPhoto ?? values.cover.contentId,
            },
          })
          channelId = result.channelId
          refetchUserMemberships()
        },
        onUploadAssets: setValue,
        onCompleted: () => {
          atlasConfig.features.ypp.googleConsoleClientId &&
            atlasConfig.features.ypp.youtubeSyncApiUrl &&
            setTimeout(() => setShowConnectToYtDialog(true), 2000)
          onCompleted?.(channelId)
        },
      })
    })()

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
