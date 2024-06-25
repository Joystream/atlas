import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'

import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { ComboBox, ComboBoxProps } from '@/components/_inputs/ComboBox'
import { Datepicker } from '@/components/_inputs/Datepicker'
import { FormField } from '@/components/_inputs/FormField'
import { TextInput } from '@/components/_inputs/Input/Input.styles'
import { useMountEffect } from '@/hooks/useMountEffect'
import { guardarianService } from '@/utils/GuardarianService'
import { GuardarianCountry } from '@/utils/GuardarianService/GuardarianService.types'

export type GuardarianBillingInfo = {
  email?: string
  firstName?: string
  lastName?: string
  dob?: Date
  country?: string
  city?: string
  street?: string
  apartment?: string
  postIndex?: string
}

type GuardarianModalBillingInfoProps = {
  onSubmit: (form: GuardarianBillingInfo) => void
  setActionButtonHandler: (fn: () => void | Promise<void>) => void
}

export const GuardarianModalBillingInfoStep = ({
  onSubmit,
  setActionButtonHandler,
}: GuardarianModalBillingInfoProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GuardarianBillingInfo>({
    defaultValues: {
      country: 'feasf',
      city: 'feasf',
      apartment: 'feasf',
      lastName: 'feasf',
      firstName: 'feasf',
      email: 'feasf@fesfs.com',
      street: 'feasf',
      postIndex: 'feasf',
      dob: new Date('11.03.2000'),
    },
  })
  const { data: countries } = useQuery({
    queryKey: 'guardarianCountries',
    queryFn: () => guardarianService.getSupportedCountries(),
  })

  const countriesOptions: ComboBoxProps<{ value: string } & GuardarianCountry>['items'] =
    useMemo(
      () =>
        countries?.map((country) => ({
          ...country,
          name: country.country_name,
          label: country.country_name,
          value: country.code_iso_alpha_3,
        })),
      [countries]
    ) ?? []

  useMountEffect(() => {
    setActionButtonHandler(handleSubmit(onSubmit))
  })

  return (
    <FlexBox flow="column" gap={4}>
      <Text as="h3" variant="h500">
        Billing information
      </Text>
      <Text as="p" variant="t300" color="colorText">
        Please fill out the form to perform a transaction. We don't require KYC to transactions under 700 USD.
      </Text>
      <Controller
        control={control}
        name="email"
        rules={{
          validate: (value) => {
            if (/^\S+@\S+\.\S+$/.test(value ?? '')) {
              return true
            }

            return 'Enter valid email address.'
          },
        }}
        render={({ field: { onChange, value } }) => (
          <FormField error={errors.email?.message} label="Email">
            <TextInput
              value={value}
              onChange={onChange}
              placeholder="alice@mail.com ... we can prepopulate"
              inputSize="large"
            />
          </FormField>
        )}
      />

      <FlexBox gap={4}>
        <Controller
          control={control}
          name="firstName"
          rules={{
            required: 'Field is required',
          }}
          render={({ field: { onChange, value } }) => (
            <FormField error={errors.firstName?.message} label="First name">
              <TextInput value={value} onChange={onChange} placeholder="Alice" inputSize="large" />
            </FormField>
          )}
        />
        <Controller
          control={control}
          name="lastName"
          rules={{
            required: 'Field is required',
          }}
          render={({ field: { onChange, value } }) => (
            <FormField error={errors.lastName?.message} label="Last name">
              <TextInput value={value} onChange={onChange} placeholder="Doe" inputSize="large" />
            </FormField>
          )}
        />
      </FlexBox>

      <FlexBox gap={4}>
        <Controller
          control={control}
          name="dob"
          rules={{
            validate: (value) => {
              if (value instanceof Date) {
                if (value.getTime() > Date.now()) {
                  return 'You cannot be born in the future, can ya?'
                }

                const nowMinusAdult = new Date()
                nowMinusAdult.setFullYear(nowMinusAdult.getFullYear() - 18)
                if (value.getTime() > nowMinusAdult.getTime()) {
                  return 'Hmmm, you seem too young to take part...'
                }

                return true
              }

              return 'Invalid date'
            },
          }}
          render={({ field: { onChange, value } }) => (
            <FormField error={errors.dob?.message} label="Date of birth">
              <Datepicker value={value} onChange={onChange} />
            </FormField>
          )}
        />
        <Controller
          control={control}
          name="country"
          rules={{
            required: 'Field is required',
          }}
          render={({ field: { onChange, value } }) => {
            const selected = countriesOptions?.find((row) => row.code_iso_alpha_3 === value)
            return (
              <FormField error={errors.country?.message} label="Select your country">
                <ComboBox
                  nodeStart={<div />}
                  value={selected?.country_name ?? value ?? ''}
                  selectedItem={selected}
                  placeholder="Poland"
                  onSelectedItemChange={(e) => {
                    onChange(e?.code_iso_alpha_3)
                  }}
                  items={countriesOptions}
                />
              </FormField>
            )
          }}
        />
      </FlexBox>

      <FlexBox gap={4}>
        <Controller
          control={control}
          name="city"
          rules={{
            required: 'Field is required',
          }}
          render={({ field: { onChange, value } }) => (
            <FormField error={errors.city?.message} label="City">
              <TextInput value={value} onChange={onChange} placeholder="Berlin" inputSize="large" />
            </FormField>
          )}
        />
        <Controller
          control={control}
          name="street"
          rules={{
            required: 'Field is required',
          }}
          render={({ field: { onChange, value } }) => (
            <FormField error={errors.street?.message} label="Street address">
              <TextInput value={value} onChange={onChange} placeholder="Street" inputSize="large" />
            </FormField>
          )}
        />
      </FlexBox>

      <FlexBox gap={4}>
        <Controller
          control={control}
          name="apartment"
          rules={{
            required: 'Field is required',
          }}
          render={({ field: { onChange, value } }) => (
            <FormField error={errors.apartment?.message} label="Apartment number">
              <TextInput value={value} onChange={onChange} placeholder="16" inputSize="large" />
            </FormField>
          )}
        />

        <Controller
          control={control}
          name="postIndex"
          rules={{
            required: 'Field is required',
          }}
          render={({ field: { onChange, value } }) => (
            <FormField error={errors.postIndex?.message} label="Post index">
              <TextInput value={value} onChange={onChange} placeholder="40-123" inputSize="large" />
            </FormField>
          )}
        />
      </FlexBox>
    </FlexBox>
  )
}
