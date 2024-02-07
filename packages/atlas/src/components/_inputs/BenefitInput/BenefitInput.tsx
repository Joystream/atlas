import { ChangeEvent } from 'react'

import { SvgActionChevronB, SvgActionChevronT } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Button } from '@/components/_buttons/Button'
import { Container, StyledSvgActionTrash } from '@/components/_inputs/BenefitInput/BenefitInput.styles'
import { Input } from '@/components/_inputs/Input'
import { TextArea } from '@/components/_inputs/TextArea'

export type Benefit = {
  title: string
  description: string
  icon?: string
}

export type BenefitInputProps = {
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
  // const smMatch = useMediaMatch('sm')
  return (
    <Container>
      {/*<FlexBox gap={2}>/!*<EmojiPlaceholder />*!/</FlexBox>*/}
      <FlexBox gap={2} alignItems="strech" flow="column">
        <Input placeholder="Add benefit title" value={title} onChange={onTitleChange} />
        <TextArea placeholder="Add benefit description" value={description} onChange={onDescriptionChange} />
      </FlexBox>
      <FlexBox gap={2} flow="column">
        <Button
          variant="tertiary"
          icon={<SvgActionChevronT />}
          title="Move benefit higher"
          onClick={onMoveUp}
          disabled={position === 'first'}
        />
        <Button
          variant="tertiary"
          icon={<SvgActionChevronB />}
          title="Move benefit lower"
          onClick={onMoveDown}
          disabled={position === 'last'}
        />
        <Button variant="tertiary" icon={<StyledSvgActionTrash />} onClick={onRemove} />
      </FlexBox>
    </Container>
  )
}
