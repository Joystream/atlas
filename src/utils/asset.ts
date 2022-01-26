import { STORAGE_UPLOAD_PATH } from '@/config/urls'

export const joinUrlFragments = (...fragments: string[]) => {
  // remove trailing/leading slashes
  const strippedFragments = fragments.map((f) => f.replace(/^\/|\/$/, ''))
  return strippedFragments.join('/')
}

export const createAssetUploadEndpoint = (operatorEndpoint: string) =>
  joinUrlFragments(operatorEndpoint, STORAGE_UPLOAD_PATH)
