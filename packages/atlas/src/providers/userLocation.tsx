import { addDays } from 'date-fns'

import { createStore } from '@/store'

export type Coordinates = { latitude: string; longitude: string }
type UserLocationStoreState = {
  coordinates: Coordinates | null
  expiry: number | null
}

type UserLocationStoreActions = {
  setUserLocation: (coordinates: Coordinates) => void
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
