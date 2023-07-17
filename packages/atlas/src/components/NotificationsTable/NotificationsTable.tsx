import { FC, Fragment, useEffect, useMemo, useState } from 'react'
import { Controller, UseFormReturn, useWatch } from 'react-hook-form'

import { SvgActionComputer, SvgActionRead } from '@/assets/icons'
import { Checkbox } from '@/components/_inputs/Checkbox'

import { Table } from './NotificationsTable.styles'

type NotificationsTableComponentProps = {
  sections: { title: string; rows: { label: string; names: { inApp: string; email: string } }[] }[]
  form: UseFormReturn<Record<string, boolean>>
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

          {rows.map(({ label, names }) => (
            <tr key={label}>
              <td>{label}</td>
              <td>
                <Controller
                  name={names.inApp}
                  control={form.control}
                  render={({ field: { value = false, onChange } }) => (
                    <Checkbox value={value} onChange={onChange} disabled={disabled} />
                  )}
                />
              </td>
              <td>
                <Controller
                  name={names.email}
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

  const names = useMemo(
    () =>
      sections.reduce<{ inApp: string[]; email: string[] }>(
        (acc, { rows }) => {
          rows.forEach(({ names }) => {
            acc.inApp.push(names.inApp)
            acc.email.push(names.email)
          })
          return acc
        },
        { inApp: [], email: [] }
      ),
    [sections]
  )
  const values = useWatch({ control: form.control })
  const { getValues, setValue } = form

  useEffect(() => {
    if (typeof allInApp === 'undefined' && typeof allEmail === 'undefined') return

    const values = getValues()
    if (typeof allInApp !== 'undefined') {
      names.inApp.forEach((k) => {
        if (values[k] !== allInApp) setValue(k, allInApp, { shouldDirty: true })
      })
    }
    if (typeof allEmail !== 'undefined') {
      names.email.forEach((k) => {
        if (values[k] !== allEmail) setValue(k, allEmail, { shouldDirty: true })
      })
    }
  }, [allInApp, allEmail, names, getValues, setValue])

  useEffect(() => {
    setAllInApp(names.inApp.every((k) => values[k]) || (names.inApp.some((k) => values[k]) ? undefined : false))
    setAllEmail(names.email.every((k) => values[k]) || (names.email.some((k) => values[k]) ? undefined : false))
  }, [values, names])

  return (
    <tr>
      <td>Subscribe to all notifications</td>

      <td>
        <Checkbox
          value={allInApp ?? true}
          indeterminate={typeof allInApp === 'undefined'}
          onChange={setAllInApp}
          disabled={disabled}
        />
      </td>

      <td>
        <Checkbox
          value={allEmail ?? true}
          indeterminate={typeof allEmail === 'undefined'}
          onChange={setAllEmail}
          disabled={disabled}
        />
      </td>
    </tr>
  )
}
