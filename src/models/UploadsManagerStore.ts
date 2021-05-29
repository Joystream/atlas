import { LiaisonJudgement } from '@/api/queries'
import { toJS } from 'mobx'
import { SnapshotOrInstance, types, cast, Instance } from 'mobx-state-tree'

const ImageCropData = types.model('AssetUpload', {
  left: types.number,
  top: types.number,
  width: types.number,
  height: types.number,
})

const AssetDimensions = types.model('AssetUpload', {
  width: types.number,
  height: types.number,
})

const ParentObject = types.model('AssetUpload', {
  type: types.enumeration(['video', 'channel']),
  id: types.string,
})

export const AssetUpload = types.model('AssetUpload', {
  contentId: types.identifier,
  parentObject: ParentObject,
  owner: types.string,
  type: types.enumeration(['video', 'thumbnail', 'cover', 'avatar']),
  lastStatus: types.maybe(types.enumeration(['completed', 'inProgress', 'error', 'reconnecting', 'reconnectionError'])),
  liaisonJudgement: types.maybe(
    types.enumeration<LiaisonJudgement>('LiaisonJudgement', Object.values(LiaisonJudgement))
  ),
  ipfsContentId: types.maybe(types.string),
  // size in bytes
  size: types.maybe(types.number),
  dimensions: types.maybe(AssetDimensions),
  imageCropData: types.maybe(ImageCropData),
  metadata: types.maybe(types.string),
  title: types.maybe(types.union(types.string, types.null)),
  progress: types.optional(types.number, 0),
})

export const UploadsManagerStore = types
  .model('UploadsManagerStore', {
    uploadingAssetsState: types.array(AssetUpload),
  })
  .views((self) => ({
    // get count() {
    //   return self.x.length
    // },
  }))
  // .volatile((self) => ({
  //   title: '',
  // }))
  .actions((self) => ({
    addAsset(asset: SnapshotOrInstance<typeof AssetUpload>) {
      self.uploadingAssetsState.push(asset)
    },
    updateAsset(asset: SnapshotOrInstance<typeof AssetUpload>) {
      const index = self.uploadingAssetsState.findIndex((a) => a.contentId === asset.contentId)
      if (index >= 0) {
        self.uploadingAssetsState[index] = { ...self.uploadingAssetsState[index], ...cast(asset) }
      }
    },
    removeAsset(asset: SnapshotOrInstance<typeof AssetUpload>) {
      self.uploadingAssetsState.remove(cast(asset))
    },
  }))

export type IAssetUpload = Instance<typeof AssetUpload>
