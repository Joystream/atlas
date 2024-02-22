import { useGetAssetUrl } from './useGetAssetUrl'

export const useVideoPreload = (mediaUrls?: string[]) =>
  !!useGetAssetUrl(mediaUrls, 'video', { resolveOnlyOnEvents: ['canplay'] })
