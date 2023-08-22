import styled from '@emotion/styled'
import { Control, Controller, useFieldArray } from 'react-hook-form'

import { SvgActionPlus } from '@/assets/icons'
import { Button } from '@/components/_buttons/Button'
import { BenefitInput } from '@/components/_inputs/BenefitInput'
import { sizes } from '@/styles'

type BenefitsInputProps = {
  name: string
  control: Control
}

export const BenefitsInput = ({ control, name }: BenefitsInputProps) => {
  const { fields, move, remove, append } = useFieldArray({
    control: control,
    name: name,
  })

  return (
    <Container>
      {fields.map((field, index) => {
        return (
          <Controller
            key={field.id}
            name={`${name}.${index}`}
            control={control}
            render={({ field: { value, onChange } }) => (
              <BenefitInput
                onMoveUp={() => move(index, index - 1)}
                onMoveDown={() => move(index, index + 1)}
                onRemove={() => remove(index)}
                title={value?.title}
                description={value?.description}
                onDescriptionChange={(e) => onChange({ ...value, description: e.target.value })}
                onTitleChange={(e) => onChange({ ...value, title: e.target.value })}
                position={index === 0 ? 'first' : index === fields.length - 1 ? 'last' : 'middle'}
              />
            )}
          />
        )
      })}
      <Button variant="tertiary" icon={<SvgActionPlus />} onClick={() => append({ title: '', description: '' })}>
        Add benefit
      </Button>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  gap: ${sizes(4)};
`
