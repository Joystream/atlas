import { VideoFormData, VideoWorkspaceVideoFormFields } from '@/providers/videoWorkspace'

type Public = {
  isPublic?: boolean
}

export const convertVideoFormDataToFormFields = (
  videoFormData: Omit<VideoFormData, 'isPublic'> & Public
): Partial<VideoWorkspaceVideoFormFields> => {
  const {
    metadata: {
      title,
      duration,
      description,
      category,
      language,
      license,
      hasMarketing,
      isPublic,
      isExplicit,
      publishedBeforeJoystream,
    },
    assets,
  } = videoFormData

  const videoAssets: VideoWorkspaceVideoFormFields['assets'] = {
    ...(assets.thumbnailPhoto
      ? {
          thumbnail: {
            cropId: assets.thumbnailPhoto.id,
            originalId: assets.thumbnailPhoto.originalId || null,
            assetDimensions: assets.thumbnailPhoto.dimensions,
            imageCropData: assets.thumbnailPhoto.cropData,
          },
        }
      : {
          thumbnail: {
            cropId: null,
            originalId: null,
          },
        }),
    ...(assets.media
      ? {
          video: {
            id: assets.media.id,
            duration: duration,
            mediaPixelHeight: assets.media.dimensions?.height,
            mediaPixelWidth: assets.media.dimensions?.width,
          },
        }
      : {
          video: {
            id: null,
          },
        }),
  }

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(category ? { category: category?.toString() } : {}),
    ...(hasMarketing ? { hasMarketing } : {}),
    ...(language ? { language } : {}),
    ...(isPublic !== undefined ? { isPublic } : {}),
    ...(isExplicit ? { isExplicit } : {}),
    ...(license?.attribution ? { licenseAttribution: license?.attribution } : {}),
    ...(license?.code ? { licenseCode: license?.code } : {}),
    ...(license?.customText ? { licenseCustomText: license?.customText } : {}),
    ...(publishedBeforeJoystream ? { publishedBeforeJoystream: new Date(Date.parse(publishedBeforeJoystream)) } : {}),
    ...(assets.media || assets.thumbnailPhoto ? { assets: videoAssets } : {}),
  }
}
