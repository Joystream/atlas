import { FC, Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, UseFormReturn, useWatch } from 'react-hook-form'

import { SvgActionComputer, SvgActionRead } from '@/assets/icons'
import { Checkbox } from '@/components/_inputs/Checkbox'

import { Table } from './NotificationsTable.styles'

export type NotificationsState = Record<string, { inAppEnabled: boolean; emailEnabled: boolean }>

export type NotificationSettingSections<Name extends string = string> = {
  title: string
  rows: { label: string; name: Name }[]
}[]

type NotificationsTableComponentProps = {
  sections: NotificationSettingSections
  form: UseFormReturn<NotificationsState>
  disabled?: boolean
}
export const NotificationsTable: FC<NotificationsTableComponentProps> = ({ sections, form, disabled }) => (
  <Table>
    <thead>
      <tr>
        <th />
        <th>
          <SvgActionComputer />
          <span>In App</span>
        </th>
        <th>
          <SvgActionRead />
          <span>Email</span>
        </th>
      </tr>
    </thead>

    <tbody>
      <SubscribeToAllRow sections={sections} form={form} disabled={disabled} />

      {sections.map(({ title, rows }) => (
        <Fragment key={title}>
          <tr>
            <th colSpan={3}>{title}</th>
          </tr>

          {rows.map(({ label, name }) => (
            <tr key={label}>
              <td>{label}</td>
              <td>
                <Controller
                  name={`${name}.inAppEnabled`}
                  control={form.control}
                  render={({ field: { value = false, onChange } }) => (
                    <Checkbox value={value} onChange={onChange} disabled={disabled} />
                  )}
                />
              </td>
              <td>
                <Controller
                  name={`${name}.emailEnabled`}
                  control={form.control}
                  render={({ field: { value = false, onChange } }) => (
                    <Checkbox value={value} onChange={onChange} disabled={disabled} />
                  )}
                />
              </td>
            </tr>
          ))}
        </Fragment>
      ))}
    </tbody>
  </Table>
)

const SubscribeToAllRow: FC<NotificationsTableComponentProps> = ({ sections, form, disabled }) => {
  const [allInApp, setAllInApp] = useState<boolean | undefined>()
  const [allEmail, setAllEmail] = useState<boolean | undefined>()

  const names = useMemo(() => sections.flatMap(({ rows }) => rows.map(({ name }) => name)), [sections])
  const values = useWatch({ control: form.control })
  const { getValues, setValue } = form

  useEffect(() => {
    const newAllInApp =
      names.every((name) => values[name]?.inAppEnabled) ||
      (names.some((name) => values[name]?.inAppEnabled) ? undefined : false)
    if (newAllInApp !== allInApp) setAllInApp(newAllInApp)

    const newAllEmail =
      names.every((name) => values[name]?.emailEnabled) ||
      (names.some((name) => values[name]?.emailEnabled) ? undefined : false)
    if (newAllEmail !== allEmail) setAllEmail(newAllEmail)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, names])

  const handleChange = useCallback(
    (key: keyof NotificationsState[string], setCurrent: (value: boolean) => void) => (isChecked: boolean) => {
      setCurrent(isChecked)

      const values = getValues()
      names.forEach((name) => {
        if (values[name][key] !== isChecked) setValue(`${name}.${key}`, isChecked, { shouldDirty: true })
      })
    },
    [names, getValues, setValue]
  )

  const handleAllInAppChange = useMemo(() => handleChange('inAppEnabled', setAllInApp), [handleChange])
  const handleAllEmailChange = useMemo(() => handleChange('emailEnabled', setAllEmail), [handleChange])

  return (
    <tr>
      <td>Subscribe to all notifications</td>

      <td>
        <Checkbox
          value={allInApp ?? true}
          indeterminate={typeof allInApp === 'undefined'}
          onChange={handleAllInAppChange}
          disabled={disabled}
        />
      </td>

      <td>
        <Checkbox
          value={allEmail ?? true}
          indeterminate={typeof allEmail === 'undefined'}
          onChange={handleAllEmailChange}
          disabled={disabled}
        />
      </td>
    </tr>
  )
}
