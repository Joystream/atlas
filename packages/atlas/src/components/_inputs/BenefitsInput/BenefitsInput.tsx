import styled from '@emotion/styled'
import { Control, Controller, FieldValues, Path, useFieldArray } from 'react-hook-form'
import { FieldArray } from 'react-hook-form/dist/types/fieldArray'
import { FieldArrayPath } from 'react-hook-form/dist/types/path'

import { SvgActionPlus } from '@/assets/icons'
import { Button } from '@/components/_buttons/Button'
import { BenefitInput } from '@/components/_inputs/BenefitInput'
import { sizes } from '@/styles'

type BenefitsInputProps<T extends FieldValues> = {
  name: FieldArrayPath<T>
  control: Control<T>
}

export const BenefitsInput = <T extends FieldValues>({ control, name }: BenefitsInputProps<T>) => {
  const { fields, move, remove, append } = useFieldArray<T>({
    control: control,
    name: name,
  })

  return (
    <Container>
      {fields.map((field, index) => {
        return (
          <Controller
            key={field.id}
            name={`${name}.${index}` as Path<T>}
            control={control}
            rules={{
              validate: (data) => {
                return !data.title ? 'Benefit is missing a title' : true
              },
            }}
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
      <Button
        variant="tertiary"
        icon={<SvgActionPlus />}
        onClick={() => append({ title: '', description: '' } as FieldArray<T, FieldArrayPath<T>>)}
      >
        Add benefit
      </Button>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  gap: ${sizes(4)};
`
