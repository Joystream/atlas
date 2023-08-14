import { ChangeEvent } from 'react'

import { SvgActionChevronB, SvgActionChevronT } from '@/assets/icons'
import { Button } from '@/components/_buttons/Button'
import { Container, FlexBox, StyledSvgActionTrash } from '@/components/_inputs/BenefitInput/BenefitInput.styles'
import { Input } from '@/components/_inputs/Input'
import { TextArea } from '@/components/_inputs/TextArea'
import { useMediaMatch } from '@/hooks/useMediaMatch'

type BenefitInputProps = {
  position: 'last' | 'first' | 'middle'
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
  title?: string
  description?: string
  onTitleChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onDescriptionChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

export const BenefitInput = ({
  onRemove,
  onMoveUp,
  onMoveDown,
  title,
  description,
  onDescriptionChange,
  onTitleChange,
  position,
}: BenefitInputProps) => {
  const smMatch = useMediaMatch('sm')
  return (
    <Container>
      <FlexBox>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'gray' }} />
      </FlexBox>
      <FlexBox dir="column">
        <Input placeholder="Add benefit title" value={title} onChange={onTitleChange} />
        <TextArea placeholder="Add benefit description" value={description} onChange={onDescriptionChange} />
      </FlexBox>
      <FlexBox dir={smMatch ? 'column' : 'row'}>
        <Button variant="tertiary" icon={<SvgActionChevronT />} onClick={onMoveUp} disabled={position === 'first'} />
        <Button variant="tertiary" icon={<SvgActionChevronB />} onClick={onMoveDown} disabled={position === 'last'} />
        <Button variant="tertiary" icon={<StyledSvgActionTrash />} onClick={onRemove} />
      </FlexBox>
    </Container>
  )
}
