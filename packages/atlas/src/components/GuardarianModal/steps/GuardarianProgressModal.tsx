import { useRef } from 'react'
import { useQuery } from 'react-query'

import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { Loader } from '@/components/_loaders/Loader'
import { guardarianService } from '@/utils/GuardarianService'

import { GuardarianModalSteps } from '../GuardarianModal.types'

type GuardarianProgressModalTypes = {
  transactionId: string
  redirectUrl: string
  goToStep: (step: GuardarianModalSteps) => void
}

export const GuardarianProgressModal = ({ transactionId, goToStep, redirectUrl }: GuardarianProgressModalTypes) => {
  const mountTimestamp = useRef(Date.now())

  useQuery(
    ['getTransactionStatus', transactionId],
    () => guardarianService.getTransactionStatus(transactionId).then((res) => res.data),
    {
      refetchInterval: 30_000,
      onSuccess: (data) => {
        if (['failed', 'cancelled'].includes(data.status)) {
          goToStep(GuardarianModalSteps.FAILED)
        }

        if (data.status === 'finished') {
          goToStep(GuardarianModalSteps.SUCCESS)
        }

        // if transaction doesn't fail or succeed after 26 min
        // the issue might be on API side, we should not waste more time waiting
        if (
          data.status === 'expired' ||
          (data.status.startsWith('waiting') && Date.now() - mountTimestamp.current > 26 * 60 * 1000)
        ) {
          goToStep(GuardarianModalSteps.TIMEOUT)
        }
      },
    }
  )

  return (
    <FlexBox flow="column" gap={4}>
      <Loader variant="medium" />
      <Text variant="h400" as="h1">
        Please continue in the popup. If you don't see one click on the link below.
      </Text>
      <TextButton to={redirectUrl}>Finalize your transaction...</TextButton>
    </FlexBox>
  )
}
