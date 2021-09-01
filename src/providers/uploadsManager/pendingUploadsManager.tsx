import { useEffect } from 'react'

import { useGetDataObjectAvailabilityLazyQuery } from '@/api/queries'

import { useSecondStore } from './secondStore'

import { useUploadsStore } from '.'

export const PendingUploadsManager = () => {
  const pendingAssetsId = useSecondStore((state) => state.pendingAssetsId)

  const setUploadStatus = useUploadsStore((state) => state.setUploadStatus)

  const [getDataObjectAvailability, { stopPolling, startPolling, data }] = useGetDataObjectAvailabilityLazyQuery({
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      startPolling?.(3000)
      data?.dataObjects.forEach((asset) => {
        if (asset.liaisonJudgement === 'ACCEPTED') {
          setUploadStatus(asset.joystreamContentId, { lastStatus: 'completed' })
        }
      })
      if (data?.dataObjects?.every((entry) => entry.liaisonJudgement === 'ACCEPTED')) {
        stopPolling?.()
      }
    },
  })

  useEffect(() => {
    if (!Object.keys.length) {
      return
    }
    const init = () => {
      getDataObjectAvailability({
        variables: {
          joystreamContentIdIn: pendingAssetsId,
        },
      })
    }
    init()
  }, [getDataObjectAvailability, pendingAssetsId])

  return null
}
