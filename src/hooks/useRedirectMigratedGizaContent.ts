import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

import { absoluteRoutes } from '@/config/routes'
import migratedGizaIdMappings from '@/data/migratedGizaIdMappings.json'

export const useRedirectMigratedGizaContent = ({ type }: { type: 'channel' | 'video' | 'embedded-video' }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    // early exit if id is not a Giza migrated one
    if (
      migratedGizaIdMappings[type === 'channel' ? 'channelIdsMapEntries' : 'videoIdsMapEntries'][
        id as keyof typeof migratedGizaIdMappings.channelIdsMapEntries
      ] === undefined
    ) {
      return
    }

    if (type === 'channel') {
      const migratedNewId: string | undefined =
        migratedGizaIdMappings.channelIdsMapEntries[id as keyof typeof migratedGizaIdMappings.channelIdsMapEntries]
      navigate(absoluteRoutes.viewer.channel(migratedNewId))
    } else if (type === 'embedded-video' || type === 'video') {
      const migratedNewId: string | undefined =
        migratedGizaIdMappings.videoIdsMapEntries[id as keyof typeof migratedGizaIdMappings.videoIdsMapEntries]

      if (type === 'embedded-video') {
        navigate(absoluteRoutes.embedded.video(migratedNewId))
      } else {
        navigate(absoluteRoutes.viewer.video(migratedNewId))
      }
    }
  }, [id, navigate, type])
}
