import { createAssetUploadEndpoint } from './asset'

const urlWithNoSlash = 'https://example.com/colossus-2'
const urlWithSlash = 'https://example.com/colossus-2/'
const notUrl = 'notaurl'
const mockedUploadParams = {
  'dataObjectId': '9999',
  'storageBucketId': '999',
  'bagId': 'dynamic:channel:999',
}

const expectedUrl =
  'https://example.com/colossus-2/api/v1/files?dataObjectId=9999&storageBucketId=999&bagId=dynamic%3Achannel%3A999'

describe('createAssetUploadEndpoint', () => {
  it('should return correct url when there is no slash in the end', () => {
    expect(createAssetUploadEndpoint(urlWithNoSlash, mockedUploadParams)).toEqual(expectedUrl)
  })

  it('should return correct url when there is slash in the end', () => {
    expect(createAssetUploadEndpoint(urlWithSlash, mockedUploadParams)).toEqual(expectedUrl)
  })

  it('should throw error when the url is incorrect', () => {
    expect(() => createAssetUploadEndpoint(notUrl, mockedUploadParams)).toThrowError()
  })
})
