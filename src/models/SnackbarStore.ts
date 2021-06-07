import { SnapshotOrInstance, types, cast, Instance, flow, getRoot, SnapshotIn } from 'mobx-state-tree'
import { autorun } from 'mobx'
import { createId } from '@/utils/createId'

export type SnackbarIconType = 'success' | 'error' | 'info' | 'warning'

const SNACKBARS_LIMIT = 3

export const Snackbar = types
  .model('Snackbar', {
    id: types.optional(types.identifier, () => createId()),
    title: types.string,
    description: types.maybe(types.string),
    timeout: types.maybe(types.number),
    variant: types.maybe(types.enumeration(['primary', 'secondary'])),
    iconType: types.maybe(types.enumeration(['success', 'error', 'info', 'warning'])),
    actionText: types.maybe(types.string),
  })
  .volatile((self) => ({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onActionClick() {},
  }))
  .actions((self) => ({
    setOnActionClick(onActionClick: () => void) {
      self.onActionClick = onActionClick
      return self
    },
    updateSnackbar(snackbar: ISnackbar) {
      self = { ...self, ...snackbar }
    },
  }))

export const SnackbarStore = types
  .model('SnackbarStore', {
    snackbars: types.array(Snackbar),
  })
  .actions((self) => ({
    afterAttach() {
      autorun(() => {
        if (self.snackbars.length > SNACKBARS_LIMIT) {
          setTimeout(() => {
            this.closeSnackbar(self.snackbars[0])
          }, 500)
        }
      })
    },
    displaySnackbar(snackbar: SnapshotIn<typeof Snackbar>, onActionClick?: () => void) {
      const sb = Snackbar.create(snackbar)
      onActionClick && sb.setOnActionClick(onActionClick)
      self.snackbars.push(sb)
      if (sb.timeout) {
        setTimeout(() => {
          this.closeSnackbar(cast(sb))
        }, sb.timeout)
      }
      return sb.id
    },
    updateSnackbar(snackbar: SnapshotOrInstance<typeof Snackbar>) {
      self.snackbars.find((s) => s.id === snackbar.id)?.updateSnackbar(cast(snackbar))
    },
    closeSnackbar(snackbar: SnapshotOrInstance<typeof Snackbar>) {
      self.snackbars.remove(cast(snackbar))
    },
  }))

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISnackbar extends Instance<typeof Snackbar> {}
