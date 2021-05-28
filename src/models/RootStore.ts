import { observable, toJS } from 'mobx'
import {
  applyAction,
  addMiddleware,
  applyPatch,
  applySnapshot,
  getSnapshot,
  IJsonPatch,
  ISerializedActionCall,
  onAction,
  onPatch,
  onSnapshot,
  SnapshotIn,
  types,
} from 'mobx-state-tree'
import { mstLog } from 'mst-log'
import { UploadsManagerStore } from './UploadsManagerStore'

export const RootStore = types.model('RootStore', {
  uploadsManagerStore: types.optional(UploadsManagerStore, {}),
})

export const store = RootStore.create(
  {},
  {
    alert: (m: string) => console.log(m),
  }
)

export const history = {
  snapshots: observable.array<{ data: SnapshotIn<typeof RootStore>; replay: () => void }>([], { deep: false }),
  actions: observable.array<{ data: ISerializedActionCall; replay: () => void }>([], { deep: false }),
  patches: observable.array<{ data: IJsonPatch; replay: () => void }>([], { deep: false }),
}

let recording = true // supress recording history when replaying
onSnapshot(store, (s) => {
  console.log({ store, snapshot: s })
  recording &&
    history.snapshots.unshift({
      data: s,
      replay() {
        recording = false
        applySnapshot(store, this.data)
        recording = true
      },
    })
})
onPatch(
  store,
  (s) =>
    recording &&
    history.patches.unshift({
      data: s,
      replay() {
        recording = false
        applyPatch(store, this.data)
        recording = true
      },
    })
)
onAction(store, (s) => {
  console.log({ store: toJS(store), action: toJS(s) })
  recording &&
    history.actions.unshift({
      data: s,
      replay() {
        recording = false
        applyAction(store, this.data)
        recording = true
      },
    })
})

// add initial snapshot
history.snapshots.push({
  data: getSnapshot(store),
  replay() {
    // TODO: DRY
    recording = false
    applySnapshot(store, this.data)
    recording = true
  },
})

addMiddleware(store, mstLog())

// @ts-ignore for playing around with the console remove on prod
window.store = store
