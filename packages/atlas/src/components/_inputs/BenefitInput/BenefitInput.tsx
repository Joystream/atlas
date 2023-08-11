import { SvgActionChevronB, SvgActionChevronT, SvgActionTrash } from '@/assets/icons'
import { Button } from '@/components/_buttons/Button'
import { Container, FlexBox } from '@/components/_inputs/BenefitInput/BenefitInput.styles'
import { Input } from '@/components/_inputs/Input'
import { TextArea } from '@/components/_inputs/TextArea'
import { useMediaMatch } from '@/hooks/useMediaMatch'

export const BenefitInput = () => {
  const smMatch = useMediaMatch('sm')
  return (
    <Container>
      <FlexBox>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'gray' }} />
      </FlexBox>
      <FlexBox dir="column">
        <Input placeholder="Add benefit title" />
        <TextArea placeholder="Add benefit description" />
      </FlexBox>
      <FlexBox dir={smMatch ? 'column' : 'row'}>
        <Button variant="tertiary" icon={<SvgActionChevronT />} />
        <Button variant="tertiary" icon={<SvgActionChevronB />} />
        <Button variant="tertiary" icon={<SvgActionTrash />} />
      </FlexBox>
    </Container>
  )
}
