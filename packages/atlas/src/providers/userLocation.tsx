import { addDays } from 'date-fns'

import { createStore } from '@/store'

export type UserCoordinates = { latitude: number; longitude: number }
type UserLocationStoreState = {
  coordinates: UserCoordinates | null
  expiry: number | null
  disableUserLocation: boolean
}

type UserLocationStoreActions = {
  setUserLocation: (coordinates: UserCoordinates) => void
  setDisableUserLocation: (disable: boolean) => void
  resetUserLocation: () => void
}

export const useUserLocationStore = createStore<UserLocationStoreState, UserLocationStoreActions>(
  {
    state: { coordinates: null, expiry: null, disableUserLocation: false },
    actionsFactory: (set) => ({
      setUserLocation: (coordinates) => {
        set((state) => {
          state.coordinates = coordinates
          state.expiry = addDays(new Date(), 7).getTime()
        })
      },
      setDisableUserLocation: (disable) =>
        set((state) => {
          state.disableUserLocation = disable
          if (disable) {
            state.coordinates = null
            state.expiry = null
          }
        }),
      resetUserLocation: () =>
        set((state) => {
          state.coordinates = null
          state.expiry = null
        }),
    }),
  },
  {
    persist: {
      key: 'userLocation',
      whitelist: ['coordinates', 'expiry', 'disableUserLocation'],
      version: 0,
      migrate: (state) => {
        return {
          ...state,
        }
      },
    },
  }
)
