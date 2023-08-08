import { useRef } from 'react'

import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'

import { Container, StatusDot, TooltipBox } from './YppStatusPill.styles'

export type YppStatusPillProps = {
  status: 'operational' | 'delayed' | 'stopped'
}

const getTooltipText = (status: YppStatusPillProps['status']) => {
  switch (status) {
    case 'delayed':
      return ['OPERATING WITH DELAYS', 'We are experiencing a bigger amount of network traffic right now.']
    case 'operational':
      return ['FULLY OPERATIONAL', 'Everything works as expected!']
    case 'stopped':
      return ['ON HOLD', 'The sync network experienced a major outage - we are currently working on fixing the issue.']
  }
}

export const YppStatusPill = ({ status }: YppStatusPillProps) => {
  const statusRef = useRef<HTMLDivElement>(null)
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
