import { STORAGE_URL_PATH } from '@/config/urls'

export const joinUrlFragments = (...fragments: string[]) => {
  // remove trailing/leading slashes
  const strippedFragments = fragments.map((f) => f.replace(/^\/|\/$/, ''))
  return strippedFragments.join('/')
}

export const createStorageNodeUrl = (contentId: string, storageMetadataUrl: string) =>
  joinUrlFragments(storageMetadataUrl, STORAGE_URL_PATH, contentId)
