import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

import { BUILD_ENV } from '@/config/envs'
import { absoluteRoutes } from '@/config/routes'
import migratedContentIdMappings from '@/data/migratedContentIdMappings.json'

export const useRedirectMigratedContent = ({ type }: { type: 'channel' | 'video' | 'embedded-video' }) => {
  const { id } = useParams() as { id?: string }
  const navigate = useNavigate()

  useEffect(() => {
    if (type !== 'channel' || !id || BUILD_ENV !== 'production') return

    const mapping = migratedContentIdMappings.channelIdsMapEntries
    const migratedId = mapping[id as keyof typeof mapping]

    if (!migratedId) return

    navigate(absoluteRoutes.viewer.channel(migratedId))
  }, [id, navigate, type])

  useEffect(() => {
    if ((type !== 'video' && type !== 'embedded-video') || !id || BUILD_ENV !== 'production') return

    const mapping = migratedContentIdMappings.videoIdsMapEntries
    const migratedId = mapping[id as keyof typeof mapping]

    if (!migratedId) return

    if (type === 'embedded-video') {
      navigate(absoluteRoutes.embedded.video(migratedId))
    } else {
      navigate(absoluteRoutes.viewer.video(migratedId))
    }
  }, [id, navigate, type])
}
