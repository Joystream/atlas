import { Text } from '@/components/Text'

import { Container, StatusDot } from './YppStatusPill.styles'

export type YppStatusPillProps = {
  status: 'operational' | 'delayed' | 'stopped'
}

export const YppStatusPill = ({ status }: YppStatusPillProps) => {
  return (
    <Container>
      <Text variant="t200" as="p">
        YPP Sync Status:
      </Text>
      <StatusDot status={status} />
    </Container>
  )
}
