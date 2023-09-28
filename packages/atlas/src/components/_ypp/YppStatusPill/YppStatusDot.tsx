import { useRef } from 'react'

import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'

import { StatusDot, TooltipBox } from './YppStatusDot.styles'

export type YppStatusType = 'operational' | 'delayed' | 'stopped'

const getTooltipText = (status: YppStatusType) => {
  switch (status) {
    case 'delayed':
      return ['OPERATING WITH DELAYS', 'We are experiencing a bigger amount of network traffic right now.']
    case 'operational':
      return ['FULLY OPERATIONAL', 'Everything works as expected!']
    case 'stopped':
    default:
      return ['ON HOLD', 'The sync network experienced a major outage - we are currently working on fixing the issue.']
  }
}

export type YppStatusDotProps = {
  status: YppStatusType
}
export const YppStatusDot = ({ status }: YppStatusDotProps) => {
  const statusRef = useRef<HTMLDivElement>(null)
  const [tooltipTitle, tooltipText] = getTooltipText(status)

  return (
    <>
      <StatusDot ref={statusRef} status={status} />
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
