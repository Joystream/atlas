import styled from '@emotion/styled'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { axiosInstance } from '@/api/axios'
import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { FlexGridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { YppStatusDot } from '@/components/_ypp/YppStatusPill'
import { atlasConfig } from '@/config'
import { cVar, sizes } from '@/styles'
import { ConsoleLogger } from '@/utils/logs'
import { YppChannelStatus } from '@/views/global/YppLandingView/YppLandingView.types'

type YppStatusDto = {
  version: string
  syncStatus: string
  syncBacklog: number
}

const YOUTUBE_BACKEND_URL = atlasConfig.features.ypp.youtubeSyncApiUrl
const YPP_DELAY_THRESHOLD = atlasConfig.features.ypp.yppDelayThreshold ?? 500

export type ServiceStatusWidgetProps = {
  status?: YppChannelStatus
}

export const ServiceStatusWidget = ({ status }: ServiceStatusWidgetProps) => {
  const { data } = useQuery('ypp-status', () =>
    axiosInstance<YppStatusDto>(`${YOUTUBE_BACKEND_URL}/status`).catch(() =>
      ConsoleLogger.warn('Failed to fetch YPP status')
    )
  )

  const details = useMemo(() => {
    if (!data) return []
    const hideData = !status || !status.startsWith('Verified')
    const output: [number | string, string, string][] = [] // [value, title, tooltip]

    // todo: all this data needs to be user scoped, rn backend does not support it
    output.push([
      hideData ? '-' : data.data.syncBacklog,
      'VIDEOS IN QUEUE',
      'This is the total amount of your YouTube videos that are waiting to be synced',
    ])
    output.push([
      hideData ? '-' : data.data.syncBacklog * 2 === 0 ? 'Syncing...' : data.data.syncBacklog * 2, // no info bout it
      'PLACE IN THE QUEUE',
      'Sync system is based on queue as we sync channels one at a time. When you reach place 1 in queue your sync will start.',
    ])
    output.push([
      // isOptedIn ? `In ${Math.round(data.data.syncBacklog / YPP_DELAY_THRESHOLD)} days` : '-',
      '-',
      'ETA TO FULL SYNC',
      'Estimated time of full sync of your videos may change based on YPP service status or  service overload.',
    ])
    return output
  }, [data, status])

  return (
    <LayoutBox>
      <FlexGridItem flow="column" gap={2} colSpan={{ xxs: 12 }}>
        <FlexBox alignItems="center" gap={2}>
          <Text variant="h200" as="span" color="colorText">
            YPP SYNC SERVICE STATUS
          </Text>
          {data ? (
            <YppStatusDot
              status={
                data.data.syncBacklog > YPP_DELAY_THRESHOLD
                  ? 'delayed'
                  : data.data.syncStatus === 'enabled'
                  ? 'operational'
                  : 'stopped'
              }
            />
          ) : null}
        </FlexBox>
        <Text variant="t100" as="p" color="colorTextMuted">
          New YT video uploads are checked once every 24 hours
        </Text>
      </FlexGridItem>
      {details.map(([value, title, tooltip], idx) => (
        <FlexGridItem key={idx} flow="column" gap={0} colSpan={{ xxs: 12, sm: 4 }}>
          <Text variant="h500" as="h4">
            {value}
          </Text>
          <FlexBox gap={2} alignItems="center">
            <Text variant="h100" as="h1" color="colorText">
              {title}
            </Text>
            <Information text={tooltip} />
          </FlexBox>
        </FlexGridItem>
      ))}
    </LayoutBox>
  )
}

const LayoutBox = styled(LayoutGrid)`
  background-color: ${cVar('colorBackgroundMuted')};
  padding: ${sizes(4)};
  height: 100%;
`
