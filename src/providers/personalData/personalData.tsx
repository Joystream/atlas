import React, { useContext } from 'react'

import { PersonalDataStoreActions, PersonalDataStoreState, usePersonalDataStore } from './store'

type ContextValue = {
  state: PersonalDataStoreState
  actions: PersonalDataStoreActions
}
const PersonalDataContext = React.createContext<ContextValue | undefined>(undefined)
PersonalDataContext.displayName = 'PersonalDataContext'

const PersonalDataProvider: React.FC = ({ children }) => {
  const {
    watchedVideos,
    followedChannels,
    recentSearches,
    dismissedMessages,
    playerVolume,
    actions,
  } = usePersonalDataStore()
  const state = { watchedVideos, followedChannels, recentSearches, dismissedMessages, playerVolume }
  const value = { state, actions }
  return <PersonalDataContext.Provider value={value}>{children}</PersonalDataContext.Provider>
}

const usePersonalData = () => {
  const context = useContext(PersonalDataContext)
  if (!context) {
    throw new Error(`usePersonalData must be used within a PersonalData Provider.`)
  }
  return context
}

export { usePersonalData, PersonalDataContext, PersonalDataProvider }
