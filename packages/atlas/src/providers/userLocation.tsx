import { addDays } from 'date-fns'

import { createStore } from '@/store'

export type UserCoordinates = { latitude: number; longitude: number }
type UserLocationStoreState = {
  coordinates: UserCoordinates | null
  expiry: number | null
}

type UserLocationStoreActions = {
  setUserLocation: (coordinates: UserCoordinates) => void
}

export const useUserLocationStore = createStore<UserLocationStoreState, UserLocationStoreActions>(
  {
    state: { coordinates: null, expiry: null },
    actionsFactory: (set) => ({
      setUserLocation: (coordinates) => {
        set((state) => {
          state.coordinates = coordinates
          state.expiry = addDays(new Date(), 7).getTime()
        })
      },
    }),
  },
  {
    persist: {
      key: 'userLocation',
      whitelist: ['coordinates', 'expiry'],
      version: 0,
      migrate: (state) => {
        return {
          ...state,
        }
      },
    },
  }
)
