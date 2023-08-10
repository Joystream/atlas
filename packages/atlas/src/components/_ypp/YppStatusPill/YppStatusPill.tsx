import { useRef } from 'react'
import { useQuery } from 'react-query'

import { axiosInstance } from '@/api/axios'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { atlasConfig } from '@/config'
import { ConsoleLogger } from '@/utils/logs'

import { Container, StatusDot, TooltipBox } from './YppStatusPill.styles'

export type YppStatusType = 'operational' | 'delayed' | 'stopped'

const getTooltipText = (status: YppStatusType) => {
  switch (status) {
    case 'delayed':
      return ['OPERATING WITH DELAYS', 'We are experiencing a bigger amount of network traffic right now.']
    case 'operational':
      return ['FULLY OPERATIONAL', 'Everything works as expected!']
    case 'stopped':
      return ['ON HOLD', 'The sync network experienced a major outage - we are currently working on fixing the issue.']
  }
}

const YOUTUBE_BACKEND_URL = atlasConfig.features.ypp.youtubeSyncApiUrl
const YPP_DELAY_THRESHOLD = atlasConfig.features.ypp.yppDelayThreshold ?? 500

type YppStatusDto = {
  version: string
  syncStatus: string
  syncBacklog: number
}

export const YppStatusPill = () => {
  const statusRef = useRef<HTMLDivElement>(null)
  const { data, isLoading } = useQuery('ypp-status', () =>
    axiosInstance<YppStatusDto>(`${YOUTUBE_BACKEND_URL}/status`).catch(() =>
      ConsoleLogger.warn('Failed to fetch YPP status')
    )
  )

  if (!data || isLoading) {
    return null
  }

  const isDelayed = data.data.syncBacklog > YPP_DELAY_THRESHOLD
  const status: YppStatusType = isDelayed ? 'delayed' : data.data.syncStatus === 'enabled' ? 'operational' : 'stopped'
  const [tooltipTitle, tooltipText] = getTooltipText(status)

  return (
    <>
      <Container ref={statusRef}>
        <Text variant="t200" as="p">
          YPP Sync Status:
        </Text>
        <StatusDot status={status} />
      </Container>
      <Tooltip
        reference={statusRef}
        placement="bottom-start"
        customContent={
          <TooltipBox>
            <Text variant="h100" as="h1" color="colorTextStrong">
              {tooltipTitle}
            </Text>
            <Text variant="t100" as="p" color="colorTextStrong">
              {tooltipText}
            </Text>
          </TooltipBox>
        }
      />
    </>
  )
}
