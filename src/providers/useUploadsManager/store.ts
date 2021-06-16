import { useCallback, useEffect, useReducer } from 'react'

import { AssetUpload, AssetUploadStatus, UploadsManagerState, UploadsManagerStateAction } from './types'

const LOCAL_STORAGE_KEY = 'uploads'

const uploadsManagerReducer = (state: UploadsManagerState, action: UploadsManagerStateAction): UploadsManagerState => {
  switch (action.type) {
    case 'ADD_ASSET':
      return [action.asset, ...state]
    case 'UPDATE_ASSET':
      return state.map((asset) => {
        if (asset.contentId !== action.contentId) {
          return asset
        }

        const assetUpdates = action.lastStatus ? { lastStatus: action.lastStatus } : {}

        return { ...asset, ...assetUpdates }
      })
    case 'REMOVE_ASSET':
      return state.filter((asset) => asset.contentId !== action.contentId)
    default:
      return state
  }
}

const getInitialState = (): UploadsManagerState => {
  const rawData = localStorage.getItem(LOCAL_STORAGE_KEY)
  return rawData ? JSON.parse(rawData) : []
}

export const useUploadsManagerStore = () => {
  const [state, dispatch] = useReducer(uploadsManagerReducer, [], getInitialState)

  // synchronize state with local storage on change
  useEffect(() => {
    const rawData = JSON.stringify(state)
    localStorage.setItem(LOCAL_STORAGE_KEY, rawData)
  }, [state])

  const addAsset = useCallback((asset: AssetUpload) => {
    dispatch({
      type: 'ADD_ASSET',
      asset,
    })
  }, [])

  const updateAsset = useCallback((contentId: string, lastStatus: AssetUploadStatus) => {
    dispatch({
      type: 'UPDATE_ASSET',
      contentId,
      lastStatus,
    })
  }, [])

  const removeAsset = useCallback((contentId: string) => {
    dispatch({
      type: 'REMOVE_ASSET',
      contentId,
    })
  }, [])

  return { uploadsState: state, addAsset, updateAsset, removeAsset }
}
