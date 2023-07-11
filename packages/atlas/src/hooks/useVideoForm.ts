import { formatISO, isValid as isValidDate } from 'date-fns'
import { useCallback, useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { VideoInputAssets, VideoInputMetadata } from '@/joystream-lib/types'
import { useChannelsStorageBucketsCount } from '@/providers/assets/assets.hooks'
import { useBloatFeesAndPerMbFees, useFee } from '@/providers/joystream/joystream.hooks'
import { useUser } from '@/providers/user/user.hooks'
import {
  VideoFormAssetData,
  VideoFormAssets,
  VideoFormData,
  VideoWorkspaceFormStatus,
  VideoWorkspaceVideoAssets,
  VideoWorkspaceVideoFormFields,
} from '@/providers/videoWorkspace'
import { SubtitlesInput } from '@/types/subtitles'
import { createId } from '@/utils/createId'
import { ConsoleLogger } from '@/utils/logs'
import { createNftInputMetadata } from '@/utils/video'
import { useVideoFormAssets } from '@/views/studio/VideoWorkspace/VideoForm/VideoForm.hooks'

type UseVideoFormProps = {
  isEdit: boolean
  id: string | null
  onSubmit: (data: VideoFormData) => Promise<void>
  form: UseFormReturn<VideoWorkspaceVideoFormFields>
}

export const useVideoForm = ({ isEdit, id, onSubmit, form }: UseVideoFormProps) => {
  const isNew = !isEdit
  const { memberId, channelId } = useUser()

  const {
    handleSubmit: createSubmitHandler,
    getValues,
    setValue,
    watch,
    trigger,
    formState: { errors, dirtyFields, isDirty, isValid },
  } = form
  const formData = getValues()

  const channelBucketsCount = useChannelsStorageBucketsCount(channelId)
  const { videoStateBloatBondValue, dataObjectStateBloatBondValue } = useBloatFeesAndPerMbFees()

  const createVideoInputMetadata = useCallback(
    (data: VideoWorkspaceVideoFormFields): VideoInputMetadata => {
      const videoInputFile = data?.assets?.video
      const license = {
        code: data.licenseCode ?? undefined,
        attribution: data.licenseAttribution ?? undefined,
        customText: data.licenseCustomText ?? undefined,
      }
      const anyLicenseFieldsDirty =
        dirtyFields.licenseCode || dirtyFields.licenseAttribution || dirtyFields.licenseCustomText

      return {
        ...(isNew || dirtyFields.title ? { title: data.title } : {}),
        ...(isNew || dirtyFields.description ? { description: data.description } : {}),
        ...(isNew || dirtyFields.category ? { category: data.category } : {}),
        ...(isNew || dirtyFields.isPublic ? { isPublic: data.isPublic } : {}),
        ...((isNew || dirtyFields.hasMarketing) && data.hasMarketing !== null
          ? { hasMarketing: data.hasMarketing }
          : {}),
        ...((isNew || dirtyFields.isExplicit) && data.isExplicit !== null ? { isExplicit: data.isExplicit } : {}),
        ...((isNew || dirtyFields.language) && data.language !== null ? { language: data.language } : {}),
        ...(isNew || anyLicenseFieldsDirty ? { license } : {}),
        ...((isNew || dirtyFields.enableComments) && data.enableComments !== null
          ? { enableComments: data.enableComments }
          : {}),
        ...((isNew || dirtyFields.publishedBeforeJoystream) &&
        data.publishedBeforeJoystream !== null &&
        isValidDate(data.publishedBeforeJoystream)
          ? {
              publishedBeforeJoystream: formatISO(data.publishedBeforeJoystream),
            }
          : {}),
        ...(isNew || dirtyFields.assets?.video
          ? {
              mimeMediaType: videoInputFile?.mimeType,
            }
          : {}),
        ...(isNew || dirtyFields.assets?.video ? { duration: Math.round(videoInputFile?.duration || 0) } : {}),
        ...(isNew || dirtyFields.assets?.video ? { mediaPixelHeight: videoInputFile?.mediaPixelHeight } : {}),
        ...(isNew || dirtyFields.assets?.video ? { mediaPixelWidth: videoInputFile?.mediaPixelWidth } : {}),
        ...(isNew || dirtyFields.subtitlesArray
          ? {
              subtitles: data.subtitlesArray?.map((subtitle, idx) => ({
                id: subtitle.id || `new-subtitle-${idx}`,
                language: subtitle.languageIso,
                type: subtitle?.type,
                mimeType: 'text/vtt',
              })),
            }
          : {}),
        clearSubtitles: !data.subtitlesArray?.length,
      }
    },
    [dirtyFields, isNew]
  )

  // for fee only
  const createBasicVideoInputAssetsInfo = (
    assets?: VideoWorkspaceVideoAssets,
    subtitles?: SubtitlesInput[]
  ): VideoInputAssets => {
    if (!assets) {
      return {}
    }
    return {
      ...(assets.video?.blob?.size
        ? {
            media: {
              ipfsHash: '',
              size: assets.video.blob.size,
            },
          }
        : {}),
      ...(assets.thumbnail?.blob?.size
        ? {
            thumbnailPhoto: {
              ipfsHash: '',
              size: assets.thumbnail.blob.size,
            },
          }
        : {}),
      ...(subtitles?.length
        ? { subtitles: subtitles.map((subtitle) => ({ ipfsHash: '', size: subtitle.file?.size || 0 })) }
        : {}),
    }
  }

  const videoInputMetadata = createVideoInputMetadata(formData)
  const nftMetadata = createNftInputMetadata(formData)
  const assets = createBasicVideoInputAssetsInfo(formData.assets, formData.subtitlesArray ?? undefined)

  const isSigned = memberId && channelId
  const { fullFee: createVideoFee, loading: createVideoFeeLoading } = useFee(
    'createVideoTx',
    isSigned && isNew
      ? [
          memberId,
          channelId,
          videoInputMetadata,
          nftMetadata,
          assets,
          dataObjectStateBloatBondValue.toString(),
          videoStateBloatBondValue.toString(),
          channelBucketsCount.toString(),
        ]
      : undefined,
    assets
  )
  const { fullFee: updateVideoFee, loading: updateVideoFeeLoading } = useFee(
    'updateVideoTx',
    isSigned && isEdit && id
      ? [
          id,
          memberId,
          videoInputMetadata,
          nftMetadata,
          assets,
          [], // provide empty removedAssetsId array to simplify fee calculation
          dataObjectStateBloatBondValue.toString(),
          channelBucketsCount.toString(),
        ]
      : undefined,
    assets
  )

  // manage assets used by the form
  const videoFormAssets = useVideoFormAssets(watch, getValues, setValue, dirtyFields, trigger, errors)
  const {
    videoHashPromise,
    thumbnailHashPromise,
    mediaAsset,
    thumbnailAsset,
    subtitlesHashesPromises,
    hasUnsavedAssets,
  } = videoFormAssets

  const submitHandler = useMemo(
    () =>
      createSubmitHandler(async (data) => {
        if (!id) {
          return
        }

        const { video: videoInputFile, thumbnail: thumbnailInputFile } = data.assets

        if (isNew && (!videoInputFile.blob || !videoHashPromise)) {
          ConsoleLogger.error('Video file cannot be empty')
          return
        }

        if (isNew && (!thumbnailAsset || !thumbnailHashPromise)) {
          ConsoleLogger.error('Thumbnail cannot be empty')
          return
        }

        const metadata = createVideoInputMetadata(data)

        const videoWidth = videoInputFile?.mediaPixelWidth
        const videoHeight = videoInputFile?.mediaPixelHeight

        const mappedSubtitles: PartialBy<VideoFormAssetData, 'blob'>[] | undefined = data?.subtitlesArray?.map(
          (subtitle, idx) => ({
            id: metadata.subtitles?.[idx].id || createId(),
            blob: subtitle.file,
            hashPromise: subtitlesHashesPromises[idx] || Promise.resolve(''),
            subtitlesLanguageIso: subtitle.languageIso,
          })
        )
        const mappedFilteredSubtitles: VideoFormAssets['subtitles'] = mappedSubtitles?.filter(
          (subtitle): subtitle is VideoFormAssetData => !!subtitle.blob
        )

        const assets: VideoFormAssets = {
          ...(videoInputFile?.blob && videoInputFile.id && videoHashPromise
            ? {
                media: {
                  id: videoInputFile.id,
                  blob: videoInputFile.blob,
                  url: videoInputFile.url || undefined,
                  hashPromise: videoHashPromise,
                  dimensions: videoWidth && videoHeight ? { height: videoHeight, width: videoWidth } : undefined,
                },
              }
            : {}),
          ...(thumbnailAsset?.blob && thumbnailInputFile.cropId && thumbnailInputFile.originalId && thumbnailHashPromise
            ? {
                thumbnailPhoto: {
                  id: thumbnailInputFile.cropId,
                  originalId: thumbnailInputFile.originalId,
                  blob: thumbnailAsset.blob,
                  url: thumbnailAsset.url || undefined,
                  hashPromise: thumbnailHashPromise,
                  dimensions: thumbnailInputFile?.assetDimensions,
                  cropData: thumbnailInputFile?.imageCropData,
                  name: (thumbnailInputFile.originalBlob as File)?.name,
                },
              }
            : {}),
          ...(mappedFilteredSubtitles?.length
            ? {
                subtitles: mappedFilteredSubtitles,
              }
            : {}),
        }

        const nftMetadata = createNftInputMetadata(data)
        onSubmit({
          metadata,
          assets,
          nftMetadata,
        })
      }),
    [
      createSubmitHandler,
      createVideoInputMetadata,
      id,
      isNew,
      onSubmit,
      subtitlesHashesPromises,
      thumbnailAsset,
      thumbnailHashPromise,
      videoHashPromise,
    ]
  )

  const isFormValid = (isEdit || !!mediaAsset) && !!thumbnailAsset && isValid
  const actionBarPrimaryText = !isEdit ? 'Publish & upload' : 'Publish changes'

  const formStatus: VideoWorkspaceFormStatus = useMemo(
    () => ({
      hasUnsavedAssets,
      isDirty,
      isDisabled: isEdit ? !isDirty : false,
      actionBarPrimaryText,
      actionBarFee: isEdit ? updateVideoFee : createVideoFee,
      actionBarFeeLoading: isEdit ? updateVideoFeeLoading : createVideoFeeLoading,
      isValid: isFormValid,
      triggerFormSubmit: submitHandler,
    }),
    [
      actionBarPrimaryText,
      createVideoFee,
      createVideoFeeLoading,
      hasUnsavedAssets,
      isDirty,
      isEdit,
      isFormValid,
      submitHandler,
      updateVideoFee,
      updateVideoFeeLoading,
    ]
  )

  return {
    formStatus,
    videoInputMetadata,
    nftMetadata,
    submitHandler,
    videoFormAssets,
  }
}
