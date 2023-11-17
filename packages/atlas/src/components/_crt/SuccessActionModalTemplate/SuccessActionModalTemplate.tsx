import { SvgAlertsSuccess32 } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { InfoStartCard, InfoStartCardProps } from '@/components/InfoStartCard'
import { Text } from '@/components/Text'
import { DialogModal, DialogModalProps } from '@/components/_overlays/DialogModal'

export type SuccessActionModalTemplateProps = {
  title: string
  description: string
  details: InfoStartCardProps[]
} & Pick<DialogModalProps, 'primaryButton' | 'show' | 'onExitClick'>

export const SuccessActionModalTemplate = ({
  details,
  title,
  description,
  ...dialogProps
}: SuccessActionModalTemplateProps) => {
  return (
    <DialogModal {...dialogProps}>
      <FlexBox flow="column" gap={6}>
        <SvgAlertsSuccess32 />
        <FlexBox flow="column" gap={2}>
          <Text variant="h500" as="h3">
            {title}
          </Text>
          <Text variant="t200" as="p">
            {description}
          </Text>
        </FlexBox>
        <FlexBox flow="column" gap={4}>
          {details.map((detail, idx) => (
            <InfoStartCard key={idx} {...detail} />
          ))}
        </FlexBox>
      </FlexBox>
    </DialogModal>
  )
}
