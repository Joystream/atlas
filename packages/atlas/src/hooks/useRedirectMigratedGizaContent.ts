import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

import { absoluteRoutes } from '@/config/routes'
import migratedGizaIdMappings from '@/data/migratedGizaIdMappings.json'

export const useRedirectMigratedGizaContent = ({ type }: { type: 'channel' | 'video' | 'embedded-video' }) => {
  const { id } = useParams() as { id?: string }
  const navigate = useNavigate()

  useEffect(() => {
    if (type !== 'channel' || !id) return

    const mapping = migratedGizaIdMappings.channelIdsMapEntries
    const migratedId = mapping[id as keyof typeof mapping]

    if (!migratedId) return

    navigate(absoluteRoutes.viewer.channel(migratedId))
  }, [id, navigate, type])

  useEffect(() => {
    if ((type !== 'video' && type !== 'embedded-video') || !id) return

    const mapping = migratedGizaIdMappings.videoIdsMapEntries
    const migratedId = mapping[id as keyof typeof mapping]

    if (!migratedId) return

    if (type === 'embedded-video') {
      navigate(absoluteRoutes.embedded.video(migratedId))
    } else {
      navigate(absoluteRoutes.viewer.video(migratedId))
    }
  }, [id, navigate, type])
}
